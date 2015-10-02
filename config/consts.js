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

// FILE STRUCTURE
consts.files = {};
consts.files.root = '/data/discourse/';
consts.files.uploads = consts.files.root+'uploads/';

consts.app = {};
consts.app.port = 8080;

module.exports = consts;
