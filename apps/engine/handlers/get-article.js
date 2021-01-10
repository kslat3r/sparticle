const getArticle = require('../lib/get-article');
const sendResponse = require('../lib/http/send-response');

module.exports = async event => {
  try {
    const article = await getArticle(event);

    return sendResponse(200, article);
  } catch (e) {
    console.error(e);

    return sendResponse(e.httpStatusCode || 500, { message: e.message });
  }
};