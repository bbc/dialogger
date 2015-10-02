var consts = require('./config/consts');
var upload = require('./config/upload');
var app = module.parent.exports.app;
var passport = module.parent.exports.passport;
var db = module.parent.exports.db;

// load controllers
module.exports.db = db;
var assetstest = require('./controllers/assetstest.js');
var assetsController = require('./controllers/assets.js');

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

app.get('/api/user', isLoggedIn, function(req, res) {
  res.json(req.user);
});

app.post('/api/assets', isLoggedIn, upload.single('file'),
    assetsController.upload);

app.get('/api/assets', isLoggedIn, assetsController.assets);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}
