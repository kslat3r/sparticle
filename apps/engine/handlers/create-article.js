const createArticle = require('../lib/create-article');
const sendResponse = require('../lib/http/send-response');

module.exports = async event => {
  try {
    const {
      statusCode,
      article
    } = await createArticle(event);

    return sendResponse(statusCode, article);
  } catch (e) {
    console.error(e);

    return sendResponse(e.httpStatusCode || 500, { message: e.message });
  }
};