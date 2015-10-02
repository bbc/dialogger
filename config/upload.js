var consts = require('./consts');
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, consts.file.uploads+req.user.username+'/')
  }
})

module.exports = multer({storage: storage});
