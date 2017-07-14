var consts        = require('./config/consts');
var express       = require('express');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var passport      = require('passport');
var bunyan        = require('bunyan');

// set up logger
var log = require('./config/log')(bunyan);
module.exports.log = log;

// set up database
var db = require('./config/db');

// set up session store
var store = require('./config/store')(session);

// set up passport
require('./config/passport')(passport, db);

// configure express
var app = express();
app.use('/public', express.static(__dirname+'/public'));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

// configure passport
app.use(session({
  secret: consts.cookie.secret,
  name: 'dialogger',
  cookie: {
    path: consts.cookie.serverPath,
    domain: consts.cookie.serverDomain
  },
  resave: false,
  saveUninitialized: false,
  store: store
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
app.listen(consts.port);
log.info('Listening on port %d', consts.port);
