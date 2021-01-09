const wikipedia = require('./wikipedia');

module.exports = url => {
  url = new URL(url);
  
  url = wikipedia(url);

  return url.toString();
}