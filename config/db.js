var consts = require('./consts')
var db = require('monk')(consts.db.url);
exports.users = db.get('users');
exports.assets = db.get('assets');
exports.edits = db.get('edits');
exports.exports = db.get('exports');
