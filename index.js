#!/usr/bin/env node

/**
 * optimize-img
 * Node CLI app to batch images optimization
 *
 * @author Mateusz Niestrój <https://github.com/NiestrojMateusz>
 */

const Jimp = require('jimp');
const globby = require('globby');
const alert = require('cli-alerts');

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const { Confirm } = require('enquirer');

const input = cli.input;
const flags = cli.flags;
const { clear, debug, source, quality, output } = flags;

(async () => {
  init({ clear });
  input.includes(`help`) && cli.showHelp(0);

  if (source) {
    if (!output) {
      const prompt = new Confirm({
        name: 'Overwrite confirm',
        message: 'Are you sure you want to overwrite source files?'
      });

      const answer = await prompt
        .run()
        .then(answer => {
          console.log('Answer:', answer ? 'Yes' : 'No');
          return answer;
        })
        .catch(console.error);

      if (!answer) {
        alert({
          type: `error`,
          name: `No overwrite`,
          msg: `You forgot to specify --output flag. No overwirte`
        });
        process.exit(0);
      }
    }

    const images = await globby(source);

    const options = {
      images,
      qulaity: quality ? +quality : 90,
      output
    };

    await Promise.all(
      options.images.map(async imgPath => {
        const image = await Jimp.read(imgPath);
        await image.quality(+options.quality);

        if (output) {
          await image.writeAsync(`${output}/${imgPath}`);
        } else {
          await image.writeAsync(`${imgPath}`);
        }
      })
    );

    alert({
      type: `success`,
      msg: `Succesfuly optimized`
    });
  } else {
    alert({
      type: `error`,
      name: `No source error`,
      msg: `You forgot to specify --source flag`
    });
  }

  debug && log(flags);
})();
