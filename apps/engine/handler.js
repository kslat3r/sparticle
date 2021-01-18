const authorizeHandler = require('./handlers/authorize');
const createArticleHandler = require('./handlers/create-article');
const getArticlesHandler = require('./handlers/get-articles');
const getArticleHandler = require('./handlers/get-article');
const deleteArticleHandler = require('./handlers/delete-article');
const updateArticleStatus = require('./handlers/update-article-status');
const updateS3ObjectAclHandler = require('./handlers/update-s3-object-acl');

// all the exports

module.exports.authorize = authorizeHandler;
module.exports.createArticle = createArticleHandler;
module.exports.getArticles = getArticlesHandler;
module.exports.getArticle = getArticleHandler;
module.exports.deleteArticle = deleteArticleHandler;
module.exports.updateArticleStatus = updateArticleStatus;
module.exports.updateS3ObjectAcl = updateS3ObjectAclHandler;
