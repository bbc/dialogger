var mimovie = require('mimovie');
var db = module.parent.exports.db;

exports.upload = function(req, res)
{
  // extract information about file
  mimovie(req.file.path, function(err, info) {
    if (err) {
      res.status(500).send('Mediainfo failed');
    } else {

      // save to database
      db.assets.insert({
        owner: req.user._id,
        name: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        info: info
      }, function(err, doc) {
        if (err) {
          res.status(500).send('Could not add to database');
        } else {
          res.json(doc);
        }
      });
    }
  });
};
