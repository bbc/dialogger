var consts = require('./consts');
var mkdirp = require('mkdirp');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var folder = consts.files.assets+req.user.username+'/';
    mkdirp(folder, function(err) {
      cb(err, folder);
    });
  }
})

module.exports = multer({storage: storage});
