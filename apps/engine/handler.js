const authorizeHandler = require('./handlers/authorize');
const createArticleHandler = require('./handlers/create-article');
const getArticlesHandler = require('./handlers/get-articles');
const getArticleHandler = require('./handlers/get-article');
const softDeleteArticleHandler = require('./handlers/soft-delete-article');
const updateArticleStatus = require('./handlers/update-article-status');
const updateAudioAclHandler = require('./handlers/update-audio-acl');

module.exports.authorize = authorizeHandler;
module.exports.createArticle = createArticleHandler;
module.exports.getArticles = getArticlesHandler;
module.exports.getArticle = getArticleHandler;
module.exports.softDeleteArticle = softDeleteArticleHandler;
module.exports.updateArticleStatus = updateArticleStatus;
module.exports.updateAudioAcl = updateAudioAclHandler;
