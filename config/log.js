var consts = require('./consts')

module.exports = function(bunyan) {
  return bunyan.createLogger({name: consts.name});
};
