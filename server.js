var consts        = require('./config/consts');
var express       = require('express');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var passport      = require('passport');

// set up database
var db = require('./config/db')

// set up passport
require('./config/passport')(passport, db);

// configure express
var app = express();
app.use('/', express.static(__dirname+'/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// configure passport
app.use(session({
  secret: consts.auth.secret,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// export variables
module.exports.app = app;
module.exports.passport = passport;
module.exports.db = db;

// set up routes
require('./routes');

// start service
app.listen(consts.app.port);
console.log('Listening on port '+consts.app.port);
