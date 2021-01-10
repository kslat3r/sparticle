const createArticleHandler = require('./handlers/create-article');
const getArticleHandler = require('./handlers/get-article');
const updateAudioAclHandler = require('./handlers/update-audio-acl');

module.exports.createArticle = createArticleHandler;
module.exports.getArticle = getArticleHandler;
module.exports.updateAudioAcl = updateAudioAclHandler;
