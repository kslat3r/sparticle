const mutateWikipediaSsml = require('./mutate-wikipedia-ssml');

module.exports = (url, ssml) => {
  url = new URL(url);

  ssml = mutateWikipediaSsml(url, ssml);
  ssml = ssml.replace(/\s&\s/g, ' and ');
  ssml = ssml.replace(/&/g, 'ampersand');

  return ssml;
}