const wikipedia = require('./wikipedia');

module.exports = (url, ssml) => {
  url = new URL(url);

  ssml = wikipedia(url, ssml);
  ssml = ssml.replace(/\s&\s/g, ' and ');

  return ssml;
}