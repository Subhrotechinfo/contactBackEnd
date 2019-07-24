let config = {};
config.allowedCorsOrigin = "*";
config.env = "dev";
config.db = {
    uri: 'mongodb://127.0.0.1:27017/acquireContactSystem'
}

config.aws = '13.233.68.42';
module.exports = {
    allowedCorsOrigin: config.allowedCorsOrigin,
    environment: config.env,
    dbStrng: config.db.uri
}
