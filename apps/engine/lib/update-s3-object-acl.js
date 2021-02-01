const makeObjectPublic = require('./storage/make-object-public');
const getArticleByPollyTaskId = require('./db/get-article-by-polly-task-id');
const updateArticleAccessibility = require('./db/update-article-accessibility');
const getArticleDuration = require('./http/get-article-duration');
const updateArticleDuration = require('./db/update-article-duration');

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
    await updateArticleAccessibility(article, true);
  } catch (e) {
    throw e;
  }

  let duration = 0;

  try {
    duration = await getArticleDuration(article);
  } catch (e) {
    throw e;
  }

  try {
    await updateArticleDuration(article, duration);
  } catch (e) {
    throw e;
  }
};