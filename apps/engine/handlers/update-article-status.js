const updateArticleStatus = require('../lib/update-article-status');

module.exports = async event => {
  try {
    await updateArticleStatus(event);
  } catch (e) {
    console.error(e);
  }
};