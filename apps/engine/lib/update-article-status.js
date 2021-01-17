const getArticleByPollyTaskId = require('./db/get-article-by-polly-task-id');
const updateArticleStatus = require('./db/update-article-status');

module.exports = async (event) => {
  if (event.Records === undefined) {
    throw new Exception('Records property is missing');
  }

  const records = event.Records;

  if (!records.length) {
    throw new Exception('No records found');
  }

  const record = event.Records[0];
  const message = record.Sns.Message;

  let task;

  try {
    task = JSON.parse(message);
  } catch (e) {
    throw e;
  }

  const pollyTaskId = task.taskId;
  const pollyTaskStatus = task.taskStatus;

  if (!pollyTaskId || !pollyTaskStatus) {
    throw new Exception('Could not ascertain properties from event');
  }
  
  let article;

  try {
    article = await getArticleByPollyTaskId(pollyTaskId);
  } catch (e) {
    throw e;
  }

  try {
    await updateArticleStatus(article, pollyTaskStatus);
  } catch (e) {
    throw e;
  }
};