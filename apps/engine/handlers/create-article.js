const createArticle = require('../lib/create-article');

module.exports = async event => {
  try {
    const article = await createArticle(event);

    return {
      statusCode: 200,
      body: JSON.stringify(article)
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: e.httpStatusCode || 500,
      body: JSON.stringify({
        message: e.message
      })
    };
  }
};