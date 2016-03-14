const exec = require('child_process').exec;
var consts = require('../config/consts');
var fs = require('fs');
var db = module.parent.exports.db;
var log = module.parent.exports.log;

exports.send = function(req, res)
{
  // list a certain asset
  db.assets.find({_id: req.params.id, owner: req.user._id},
      function(err, docs) {
    if (err) log.error(err);
    else {
      // make temporary file
      exec('mktemp', function(mktemperr, stdout, stderr) {
        if (mktemperr) return log.error(stderr);
        tempfile = stdout.trim();

        // write transcript to file
        fs.writeFile(tempfile, JSON.stringify(docs[0].transcript),
          function(writeerr, message)
        {
          if (writeerr) return log.error(writeerr);

          // upload file
          exec(consts.pen.uploadcommand + '-T '+tempfile+
            consts.pen.uploadargs+'"'+consts.pen.uploaddest+docs[0].name+'.json"',
            function(senderr, sendstdout, sendstderr)
          {
            if (senderr) return log.error(sendstdout+sendstderr);
            log.info('Transcript printed');
            res.json({success: true});
          });
        });
      });
    }
  });
};
