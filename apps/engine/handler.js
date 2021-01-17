const authorizeHandler = require('./handlers/authorize');
const createArticleHandler = require('./handlers/create-article');
const getArticlesHandler = require('./handlers/get-articles');
const getArticleHandler = require('./handlers/get-article');
const deleteArticleHandler = require('./handlers/delete-article');
const updateAudioAclHandler = require('./handlers/update-audio-acl');

module.exports.authorize = authorizeHandler;
module.exports.createArticle = createArticleHandler;
module.exports.getArticles = getArticlesHandler;
module.exports.getArticle = getArticleHandler;
module.exports.deleteArticle = deleteArticleHandler;
module.exports.updateAudioAcl = updateAudioAclHandler;
