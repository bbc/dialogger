var LocalStrategy = require('passport-local').Strategy;
var consts = require('./consts');
var log = module.parent.exports.log;

module.exports = function(passport, db)
{
  // get user's database id
  passport.serializeUser(function(username, done)
  {
    db.users.findOne({username: username}, function(err, user) {
      if (err) {
        log.error(err);
        done(err);

      // if user not found, create an account
      } else if (!user) {
        db.users.insert({username: username,
                         dateCreated: new Date()}, function(err, user) {
          if (err) {
            log.error(err);
            done(err);
          } else {
            log.info({user: user}, 'Created user');
            done(null, user._id);
          }
        });
      } else {
        done(null, user._id);
      }
    });
  });

  // retrieve user details from database
  passport.deserializeUser(function(id, done) {
    db.users.findById(id, function(err, user) {
      if (err) {
        log.error(err);
        done(err);
      } else {
        done(null, user);
      }
    });
  });

  // configure passport strategy
  passport.use( new LocalStrategy( function(username, password, done) {
    db.users.findOne({username: username}, function(err, user) {
      if (err) {
        log.error(err);
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: consts.msg.authFail });
      }
      if (!user.verifyPassword(password)) {
        return done(null, false, { message: consts.msg.authFail });
      }
      return done(null, username);
    });
  }));
};
