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
const ora = require('ora');
const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const { Confirm } = require('enquirer');

const input = cli.input;
const flags = cli.flags;
const { clear, debug, source, quality, output, extensions, oneFile } = flags;

(async () => {
  init({ clear });
  input.includes(`help`) && cli.showHelp(0);

  const spinner = ora('Optimizing');
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

    spinner.start();
    const allowedExtensions = ['png', 'jpg', 'tiff', 'jpeg', 'bmp'];
    const filesExtensions = extensions
      ? extensions
          .replace(' ', '')
          .split(',')
          .filter(ext => allowedExtensions.includes(ext))
          .join('|')
      : allowedExtensions.join('|');
    let images;
    if (oneFile) {
      images = await globby(source);
    } else {
      images = await globby([`${source}/*.(${filesExtensions})`]);
    }

    if (!images.length) {
      spinner.stop();
      alert({
        type: `info`,
        msg: `No images found`
      });
      process.exit(0);
    }

    const options = {
      images,
      qulaity: quality ? +quality : 90,
      output
    };

    let count = 0;
    let omitted = await Promise.all(
      options.images.map(async imgPath => {
        try {
          const image = await Jimp.read(imgPath);
          const outputPath = output ? `${output}/${imgPath}` : `${imgPath}`;
          await image.quality(+options.quality);
          await image.writeAsync(outputPath);
          count++;
        } catch (error) {
          console.log(imgPath);
          return null;
        }
      })
    );

    spinner.stop();
    alert({
      type: `success`,
      msg: `Succesfuly optimized ${count} images`
    });
  } else {
    spinner.stop();
    alert({
      type: `error`,
      name: `No source error`,
      msg: `You forgot to specify --source flag`
    });
  }

  debug && log(flags);
})();
