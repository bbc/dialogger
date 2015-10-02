var mimovie = require('mimovie');
var fs = require('fs');
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
        info: info,
        status: 'Transcribing'
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

exports.assets = function(req, res)
{
  // list user's assets
  db.assets.find({owner: req.user._id}, function(err, docs) {
    res.json(docs);
  });
};

exports.save = function(req, res)
{
  db.assets.findById(req.params.id, function(err, doc)
  {
    // check owner
    if (err || !doc.owner.equals(req.user._id)) {
      res.status(500).send('Could not find asset');

    // save update
    } else {
      db.assets.updateById(req.params.id,
        { $set: {name: req.body.name} }, function(err, result) {
        if (err) {
          res.status(500).send('Could not update');
        } else {
          res.json(result);
        }
      });
    }
  });
};

exports.destroy = function(req, res)
{
  db.assets.findById(req.params.id, function(err, doc)
  {
    // check owner
    if (err || !doc.owner.equals(req.user._id)) {
      res.status(500).send('Could not find asset');

    // delete file and document
    } else {
      fs.unlink(doc.path);
      db.assets.remove({_id: req.params.id}, function(err) {
        if (err) {
          res.status(500).send('Could not delete document');
        } else {
          res.json({success: true});
        }
      });
    }
  });
};
