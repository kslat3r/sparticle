const authorize = require('../lib/authorize');
const sendResponse = require('../lib/http/send-response');

module.exports = async (event) => {
  try {
    const token = authorize(event);

    return sendResponse(201, token);
  } catch (e) {
    console.error(e);

    return sendResponse(e.httpStatusCode || 500, { message: e.message });
  }
};