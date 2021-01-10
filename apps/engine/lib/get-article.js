const authorizeRequest = require('./http/authorize-request');
const getArticleById = require('./db/get-article-by-id');
const getTaskById = require('./speech/get-task-by-id');
const RequestException = require('./exceptions/Request');

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

  // get task

  let task;
  
  try {
    task = await getTaskById(article.pollyTaskId);
  } catch (e) {
    throw e;
  }

  // add latest status

  article.status = task.SynthesisTask.TaskStatus;

  return article;
};