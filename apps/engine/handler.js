const authorizeHandler = require('./handlers/authorize');
const createArticleHandler = require('./handlers/create-article');
const getArticlesHandler = require('./handlers/get-articles');
const getFavouriteArticlesHandler = require('./handlers/get-favourite-articles');
const getArchivedArticlesHandler = require('./handlers/get-archived-articles');
const getArticleHandler = require('./handlers/get-article');
const deleteArticleHandler = require('./handlers/delete-article');
const updateArticleHandler = require('./handlers/update-article');
const updateArticleStatus = require('./handlers/update-article-status');
const updateS3ObjectAclHandler = require('./handlers/update-s3-object-acl');

// all the exports

module.exports.authorize = authorizeHandler;
module.exports.createArticle = createArticleHandler;
module.exports.getArticles = getArticlesHandler;
module.exports.getFavouriteArticles = getFavouriteArticlesHandler;
module.exports.getArchivedArticles = getArchivedArticlesHandler;
module.exports.getArticle = getArticleHandler;
module.exports.deleteArticle = deleteArticleHandler;
module.exports.updateArticle = updateArticleHandler;
module.exports.updateArticleStatus = updateArticleStatus;
module.exports.updateS3ObjectAcl = updateS3ObjectAclHandler;
