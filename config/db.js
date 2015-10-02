var consts = require('./consts')
var db = require('monk')(consts.db.url);
exports.users = db.get('users');
exports.assets = db.get('assets');
