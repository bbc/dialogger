var consts = require('./consts')
var log = module.parent.exports.log;
var mongoSession = require('connect-mongodb-session');

module.exports = function(session) {
  var mongoStore = mongoSession(session);
  var store = new mongoStore({
    uri: consts.db.url,
    collection: consts.db.sessionCollection
  });
  store.on('error', function(err) {
    log.error(err);
  });
  return store;
};
