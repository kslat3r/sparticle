const updateArticle = require('../lib/update-article');
const sendResponse = require('../lib/http/send-response');

module.exports = async event => {
  let article;

  try {
    article = await updateArticle(event);

    return sendResponse(200, article);
  } catch (e) {
    console.error(e);

    return sendResponse(e.httpStatusCode || 500, { message: e.message });
  }
};