const makeObjectPublic = require('./storage/make-object-public');
const getArticleByPollyTaskId = require('./db/get-article-by-polly-task-id');
const updateArticleAccessible = require('./db/update-article-accessible');

module.exports = async (event) => {
  if (event.Records === undefined) {
    throw new Exception('Records property is missing');
  }

  const records = event.Records;

  if (!records.length) {
    throw new Exception('No records found');
  }

  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = record.s3.object.key;

  try {
    await makeObjectPublic(bucket, key);
  } catch (e) {
    throw e;
  }

  const pollyTaskId = key.replace('.mp3', '');

  let article;

  try {
    article = await getArticleByPollyTaskId(pollyTaskId);
  } catch (e) {
    throw e;
  }

  try {
    await updateArticleAccessible(article, true);
  } catch (e) {
    throw e;
  }
};