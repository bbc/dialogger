var consts        = require('./config/consts');
var express       = require('express');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var passport      = require('passport');

// set up passport
require('./config/passport')(passport);

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

// set up routes
require('./app/routes')(app, passport);

// start service
app.listen(consts.app.port);
console.log('Listening on port '+consts.app.port);
