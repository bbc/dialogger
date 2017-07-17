var consts = {};

consts.name = 'dialogger';
consts.port = 8080;

// DATABASE
consts.db = {};
consts.db.url = 'mongodb://mongo:27017/dialogger';
consts.db.sessionCollection = 'sessions';

// COOKIES 
consts.cookie = {};
consts.cookie.serverPath = '/';
consts.cookie.serverDomain = 'localhost';
consts.cookie.secret = 'dialoggersecret';

// MESSAGES
consts.msg = {};
consts.msg.authFail = 'Incorrect username or password.';
consts.msg.previewErr = 'Transcoding failed.';
consts.msg.sttErr = 'Transcription failed.';

// FILE STRUCTURE
consts.files = {};
consts.files.root = '/usr/src/dialogger/data/';
consts.files.assets = consts.files.root+'assets/';

// PREVIEW FILE 
consts.preview = {};
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

module.exports = consts;
