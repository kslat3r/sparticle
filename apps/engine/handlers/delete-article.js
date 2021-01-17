const deleteArticle = require('../lib/delete-article');
const sendResponse = require('../lib/http/send-response');

module.exports = async event => {
  try {
    await deleteArticle(event);

    return sendResponse(200);
  } catch (e) {
    console.error(e);

    return sendResponse(e.httpStatusCode || 500, { message: e.message });
  }
};