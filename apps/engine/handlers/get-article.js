const getArticle = require('../lib/get-article');

module.exports = async event => {
  try {
    const article = await getArticle(event);

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