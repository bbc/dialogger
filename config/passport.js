var LocalStrategy = require('passport-local').Strategy;
var ActiveDirectory = require('activedirectory');
var consts = require('./consts');

module.exports = function(passport)
{
  // set up active directory module
  var ad = new ActiveDirectory({
      url: consts.auth.url,
      baseDN: consts.auth.baseDn
  });

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    done(null, id);
  });

  // configure passport strategy
  passport.use( new LocalStrategy( function(username, password, done) {
    ad.authenticate(consts.auth.domainPrefix+username,
                    password, function(error, valid) {
      if (error) {
        if (error.name === 'InvalidCredentialsError') {
          return done(null, false, { message: consts.auth.msgFail });
        } else {
          return done(consts.auth.msgError);
        }
      }
      if (valid) {
        return done(null, username);
      } else {
        return done(null, false, { message: consts.auth.msgFail });
      }
    });
  }
  ));
};
