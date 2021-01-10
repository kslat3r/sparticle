const mutateWikipediaUrl = require('./mutate-wikipedia-url');

module.exports = url => {
  url = new URL(url);
  
  url = mutateWikipediaUrl(url);

  return url.toString();
}