var consts = require('./consts')
var EmailStream = require('bunyan-emailstream').EmailStream;

var email = new EmailStream(
  { from: consts.log.systemEmail,
    to: consts.log.adminEmail
  },
  { type: 'SMTP',
    host: consts.log.smtpServer,
    port: 25
  }
);

module.exports = function(bunyan) {
  return bunyan.createLogger({
    name: consts.name,
    streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      type: 'raw',
      stream: email,
      level: 'error'
    }]
  });
};
