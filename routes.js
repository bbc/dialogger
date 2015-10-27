var consts = require('./config/consts');
var upload = require('./config/upload');
var app = module.parent.exports.app;
var passport = module.parent.exports.passport;
var db = module.parent.exports.db;
var log = module.parent.exports.log;

// load controllers
module.exports.db = db;
module.exports.log = log;
var assetsController = require('./controllers/assets.js');
var editsController = require('./controllers/edits.js');

app.get('/', function(req, res) {
  if (req.isAuthenticated()) {
    res.sendFile(__dirname+'/public/editor.html');
  } else {
    res.sendFile(__dirname+'/public/index.html');
  }
});

app.get('/about', function(req, res) {
  res.sendFile(__dirname+'/public/about.html');
});

app.post('/api/login', passport.authenticate('local',
  {successRedirect: '/api/loginSuccess',
   failureRedirect: '/api/loginFailure',
   failureFlash: false }
));

app.get('/api/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/api/loginSuccess', function(req, res) {
  log.info({user: req.user}, 'User logged in');
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

// ASSETS
app.post('/api/assets', isLoggedIn, upload.single('file'),
    assetsController.save);
app.get('/api/assets', isLoggedIn, assetsController.assets);
app.get('/api/assets/:id', isLoggedIn, assetsController.asset);
app.put('/api/assets/:id', isLoggedIn, assetsController.update);
app.delete('/api/assets/:id', isLoggedIn, assetsController.destroy);
app.get('/api/assets/preview/:id', isLoggedIn, assetsController.preview);

// EDITS
app.post('/api/edits', isLoggedIn, editsController.save);
app.get('/api/edits', isLoggedIn, editsController.edits);
app.get('/api/edits/:id', isLoggedIn, editsController.edit);
app.put('/api/edits/:id', isLoggedIn, editsController.update);
app.delete('/api/edits/:id', isLoggedIn, editsController.destroy);
app.post('/api/edits/export/:id', isLoggedIn, editsController.transcode);
app.get('/api/edits/export/:jobid', isLoggedIn, editsController.download);
app.get('/api/edits/export/status/:jobid', isLoggedIn, editsController.download);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}
