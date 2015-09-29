var consts = require('../config/consts');

module.exports = function(app, passport) {

  app.post('/api/login', passport.authenticate('local',
    {successRedirect: '/api/loginSuccess',
     failureRedirect: '/api/loginFailure',
     failureFlash: false }
  ));

  app.get('/api/loginSuccess', function(req, res) {
    res.json({success: true});
  });

  app.get('/api/loginFailure', function(req, res) {
    res.json({
      success: false,
      message: consts.auth.msgFail});
  });

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}
