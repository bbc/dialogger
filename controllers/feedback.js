var consts = require('../config/consts');
var path = require('path');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var log = module.parent.exports.log;

exports.form = function(req, res)
{
  res.sendFile(path.join(__dirname, '../public/feedback.html'));
};

exports.process = function(req, res)
{
  if (req.body.message && req.body.type) {
    var transporter = nodemailer.createTransport(smtpTransport({
      host: consts.log.smtpServer,
      port: 25
    }));
    transporter.sendMail({
      from: consts.log.systemEmail,
      to: consts.log.adminEmail,
      subject: req.body.type,
      text: 'Name:\r\n'+req.body.name+'\r\n\r\n'+
            'Email:\r\n'+req.body.email+'\r\n\r\n'+
            'Message:\r\n'+req.body.message
    }, function(err, info) {
      if (err) {
        log.error(err);
        res.json({success: false});
      } else {
        res.json({success: true});
      }
    });
  } else {
    res.json({success: false});
  }
};
