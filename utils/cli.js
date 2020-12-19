const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
  extensions: {
    type: 'string',
    alias: 'e',
    desc: 'Define extensions to match. Separated by comma'
  },
  output: {
    type: 'string',
    alias: 'o',
    desc: 'Relative path to output dir'
  },
  source: {
    type: `string`,
    alias: `s`,
    desc: `Input file or directory of images`
  },
  quality: {
    type: `string`,
    alias: `q`,
    desc: `Quality of output images`
  },
  clear: {
    type: `boolean`,
    default: true,
    alias: `c`,
    desc: `Clear the console`
  },
  'no-clear': {
    type: `boolean`,
    default: false,
    desc: `Don't clear the console`
  },
  debug: {
    type: `boolean`,
    default: false,
    alias: `d`,
    desc: `Print debug info`
  },
  version: {
    type: `boolean`,
    alias: `v`,
    desc: `Print CLI version`
  }
};

const commands = {
  help: { desc: `Print help info` }
};

const helpText = meowHelp({
  name: `optimize-img`,
  flags,
  commands
});

const options = {
  inferType: true,
  description: false,
  hardRejection: false,
  flags
};

module.exports = meow(helpText, options);
