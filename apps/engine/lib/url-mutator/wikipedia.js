module.exports = url => {
  url.host = url.host.replace('wikipedia.org', 'm.wikipedia.org');

  return url;
}