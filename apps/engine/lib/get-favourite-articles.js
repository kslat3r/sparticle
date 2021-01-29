const authorizeRequest = require('./http/authorize-request');
const getFavouriteArticlesBySessionId = require('./db/get-favourite-articles-by-session-id');

module.exports = async (event) => {
  // authorize

  let sessionId;

  try {
    sessionId = authorizeRequest(event);
  } catch (e) {
    throw e;
  }
  
  // get articles

  let articles;

  try {
    articles = await getFavouriteArticlesBySessionId(sessionId);
  } catch (e) {
    throw e;
  }

  // we're good
  
  return articles;
};