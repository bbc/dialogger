var LocalStrategy = require('passport-local').Strategy;
var ActiveDirectory = require('activedirectory');
var consts = require('./consts');
var log = module.parent.exports.log;

module.exports = function(passport, db)
{
  // set up active directory module
  var ad = new ActiveDirectory({
      url: consts.auth.url,
      baseDN: consts.auth.baseDn
  });

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
            db.assets.findById('56b1d6b6aba63c1836383817', function(err, asset) {
              if (err) {
                log.error(err);
              } else {
                asset.owner = user._id;
                delete asset._id;
                db.assets.insert(asset, function(err, asset) {
                  if (err) {
                    log.error(err);
                  } else {
                    log.info({user: user}, 'Created user');
                    done(null, user._id);
                  }
                });
              }
            });
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
    ad.authenticate(consts.auth.domainPrefix+username,
                    password, function(error, valid) {
      if (error) {
        if (error.name === 'InvalidCredentialsError') {
          return done(null, false, { message: consts.auth.msgFail });
        } else {
          log.error(error);
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
