const authorizeRequest = require('./http/authorize-request');
const getArticleById = require('./db/get-article-by-id');
const deleteArticle = require('./db/delete-article');
const RequestException = require('./exception/Request');
const ForbiddenException = require('./exception/Forbidden');

module.exports = async (event) => {
  // authorize

  let sessionId;

  try {
    sessionId = authorizeRequest(event);
  } catch (e) {
    throw e;
  }
  
  // validation
  
  if (event.pathParameters === undefined || event.pathParameters.id === undefined) {
    throw new RequestException('Mandatory path parameter \'id\' is missing');
  }

  const id = event.pathParameters.id;

  // get article

  let article;

  try {
    article = await getArticleById(id);
  } catch (e) {
    throw e;
  }

  // does article belong to logged in user?

  if (sessionId !== article.sessionId) {
    throw new ForbiddenException('User does not have access to this article');
  }

  // soft delete article

  try {
    await deleteArticle(article);
  } catch (e) {
    throw e;
  }

  return
};