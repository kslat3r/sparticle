const authorizeRequest = require('./http/authorize-request');
const getArticlesBySessionId = require('./db/get-articles-by-session-id');
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
  
  // get articles

  let articles;

  try {
    articles = await getArticlesBySessionId(sessionId);
  } catch (e) {
    throw e;
  }

  // get tasks

  let tasks;
  
  try {
    tasks = await Promise.all(articles.map(article => getTaskById(article.pollyTaskId)));
  } catch (e) {
    throw e;
  }

  // add latest status to articles

  tasks.forEach((task, i) => articles[i].status = task.SynthesisTask.TaskStatus);

  return articles;
};