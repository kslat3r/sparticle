module.exports = (url, ssml) => {
  if (url.host.includes('wikipedia.org')) {
    ssml = ssml.replace(/Edit\n\[.*\]/g, '');
    ssml = ssml.replace(/\[\/wiki\/[\w-_()]+\]/g, '');
  }

  return ssml;
}