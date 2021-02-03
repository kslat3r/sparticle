const authorizeRequest = require('./http/authorize-request');
const getArticleById = require('./db/get-article-by-id');
const updateArticleFavourite = require('./db/update-article-favourite');
const updateArticleElapsed = require('./db/update-article-elapsed');
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

  if (event.body === undefined) {
    throw new RequestException('Mandatory request body is missing');
  }

  let body;

  try {
    body = JSON.parse(event.body);
  } catch (e) {
    throw new RequestException('Mandatory request body is not valid JSON');
  }

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

  // update favourite?

  if (body.favourite !== undefined) {
    try {
      article = await updateArticleFavourite(article, body.favourite);
    } catch (e) {
      throw e;
    }
  }

  // update elapsed?

  if (body.s3ObjectElapsed !== undefined) {
    try {
      article = await updateArticleElapsed(article, body.s3ObjectElapsed);
    } catch (e) {
      throw e;
    }
  }

  return article;
};