var consts = {};

consts.name = 'discourse';

// DATABASE
consts.db = {};
consts.db.url = 'mongodb://localhost:27017/discourse';
consts.db.sessionCollection = 'sessions';

// LOGGING
consts.log = {};
consts.log.systemEmail = 'discourse-logger@rd.bbc.co.uk';
consts.log.adminEmail = 'chris.baume@bbc.co.uk';
consts.log.smtpServer = 'smtp.rd.bbc.co.uk';

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
consts.files.assets = consts.files.root+'assets/';
consts.files.temp = consts.files.root+'temp/';

// SPEECH TO TEXT
consts.stt = {};
consts.stt.root = 'http://stt.rd.bbc.co.uk/api/v0.1';
consts.stt.upload = consts.stt.root;
consts.stt.status = consts.stt.root+'/status/';
consts.stt.transcript = consts.stt.root+'/transcript/';
consts.stt.segments = consts.stt.root+'/segments/';
consts.stt.checkInterval = 10;
consts.stt.preStatus = 'Transcribing';
consts.stt.postStatus = 'Ready';
consts.stt.errStatus = 'Transcription failed';

// TRANSCODER
consts.transcoder = {};
consts.transcoder.root = 'http://172.29.94.117/api/v0.1';
consts.transcoder.upload = consts.transcoder.root;
consts.transcoder.status = consts.transcoder.root+'/status/';
consts.transcoder.output = '/data/melt/output/';
consts.transcoder.videoPreview = {vcodec: 'libx264',
                                  vb: '500k',
                                  width: 300,
                                  height: 168,
                                  rescale: 'bicubic',
                                  tune: 'fastdecode',
                                  strict: 'experimental',
                                  acodec: 'aac',
                                  ab: '128k'};
consts.transcoder.audioPreview = {acodec: 'aac', ab: '128k'};
consts.transcoder.checkInterval = 5;

consts.app = {};
consts.app.port = 8080;

module.exports = consts;
