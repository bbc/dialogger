var consts = {};

// DATABASE
consts.db = {};
consts.db.url = 'localhost/discourse';

// AUTHENTICATION
consts.auth = {};
consts.auth.url = 'ldap://national.core.bbc.co.uk';
consts.auth.baseDn = 'null';
consts.auth.domainPrefix = 'NATIONAL\\';
consts.auth.msgFail = 'Incorrect username or password.';
consts.auth.msgError = 'An error was encountered during authentication.';
consts.auth.secret = 'bbcresearchanddevelopment';

consts.app = {};
consts.app.port = 8080;

module.exports = consts;
