const isBase64 = require('is-base64');
const isValidHttpUrl = require('is-valid-http-url');
const authorizeRequest = require('./http/authorize-request');
const mutateUrl = require('./url/mutate-url');
const getHtmlFromUrl = require('./html/get-html-from-url');
const getContentFromHtml = require('./content/get-content-from-html');
const getSsmlFromContent = require('./ssml/get-ssml-from-content');
const mutateSsml = require('./ssml/mutate-ssml');
const createTask = require('./speech/create-task');
const createArticle = require('./db/create-article');
const RequestException = require('./exception/Request');
const InternalException = require('./exception/Internal');

module.exports = async (event) => {
  // authorize

  let sessionId;

  try {
    sessionId = authorizeRequest(event);
  } catch (e) {
    throw e;
  }

  // validate
  
  if (event.body === undefined) {
    throw new RequestException('Mandatory request body is missing');
  }

  let body;

  try {
    body = JSON.parse(event.body);
  } catch (e) {
    throw new RequestException('Mandatory request body is not valid JSON');
  }

  if (body.encodedUrl === undefined) {
    throw new RequestException('Mandatory request body property \'encodedUrl\' is missing');
  }

  const encodedUrl = body.encodedUrl;

  if (!isBase64(encodedUrl)) {
    throw new RequestException('Mandatory request body property \'encodedUrl\' should be encoded as a base64 string');
  }

  let url = Buffer.from(encodedUrl, 'base64').toString()
  
  if (!isValidHttpUrl(url)) {
    throw new RequestException('Mandatory request body property \'encodedUrl\' should be a valid URL encoded as a base64 string');
  }

  // mutate url

  url = mutateUrl(url);

  // get url contents

  let html;

  try {
    html = await getHtmlFromUrl(url);
  } catch (e) {
    throw new InternalException(e.message);
  }

  // get content

  let content;

  try {
    content = getContentFromHtml(html);
  } catch (e) {
    throw new InternalException(e.message);
  }

  // convert to ssml

  let ssml;

  try {
    ssml = getSsmlFromContent(content);
  } catch (e) {
    throw new InternalException(e.message);
  }

  ssml = mutateSsml(url, ssml);

  // create task

  try {
    task = await createTask(ssml);
  } catch (e) {
    throw e;
  }

  // create article

  try {
    article = await createArticle(task, url, sessionId);
  } catch (e) {
    throw e;
  }

  // add latest status

  article.status = task.SynthesisTask.TaskStatus;

  return article;
};