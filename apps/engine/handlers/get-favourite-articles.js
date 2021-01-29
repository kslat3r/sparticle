const getFavouriteArticles = require('../lib/get-favourite-articles');
const sendResponse = require('../lib/http/send-response');

module.exports = async event => {
  try {
    const articles = await getFavouriteArticles(event);

    return sendResponse(200, articles);
  } catch (e) {
    console.error(e);

    return sendResponse(e.httpStatusCode || 500, { message: e.message });
  }
};