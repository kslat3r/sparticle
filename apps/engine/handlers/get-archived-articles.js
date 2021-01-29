const getArchivedArticles = require('../lib/get-archived-articles');
const sendResponse = require('../lib/http/send-response');

module.exports = async event => {
  try {
    const articles = await getArchivedArticles(event);

    return sendResponse(200, articles);
  } catch (e) {
    console.error(e);

    return sendResponse(e.httpStatusCode || 500, { message: e.message });
  }
};