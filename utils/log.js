const alert = require('cli-alerts');

module.exports = (info, msg = '') => {
  alert({
    type: `warning`,
    name: `DEBUG LOG`,
    msg
  });

  console.log(info);
  console.log();
};
