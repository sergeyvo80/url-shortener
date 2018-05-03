let config = {
  host: '127.0.0.1',
  port: 3000,
  dbhost: 'http://localhost:5984',
  dbname: 'url-shortener'
};
config.webRoot = 'http://' + config.host + ':' + config.port;
module.exports = config;
