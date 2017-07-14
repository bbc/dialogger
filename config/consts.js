var consts = {};

consts.name = 'dialogger';

// DATABASE
consts.db = {};
consts.db.url = 'mongodb://localhost:27017/dialogger';
consts.db.sessionCollection = 'sessions';

// SERVER
consts.server = {};
consts.server.path = '/';
consts.server.domain = 'bbc.co.uk';

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
consts.files.root = '/data/dialogger/';
consts.files.assets = consts.files.root+'assets/';
consts.files.temp = consts.files.root+'temp/';

// PREVIEW FILE 
consts.preview.video = {vcodec: 'libx264',
                        vb: '500k',
                        width: 300,
                        height: 168,
                        rescale: 'bicubic',
                        tune: 'fastdecode',
                        strict: 'experimental',
                        acodec: 'aac',
                        ab: '128k'};
consts.preview.audio = {acodec: 'aac', ab: '128k'};
consts.preview.errStatus = 'Preview file generation failed';

consts.app = {};
consts.app.port = 80;

module.exports = consts;
