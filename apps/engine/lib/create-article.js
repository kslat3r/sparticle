const isBase64 = require('is-base64');
const isValidHttpUrl = require('is-valid-http-url');
const authorizeRequest = require('./http/authorize-request');
const getArticleById = require('./db/get-article-by-id');
const getArticleByEncodedUrl = require('./db/get-article-by-encoded-url');
const createArticle = require('./db/create-article');
const getHtmlFromUrl = require('./html/get-html-from-url');
const getContentFromHtml = require('./content/get-content-from-html');
const getSsmlFromContent = require('./ssml/get-ssml-from-content');
const mutateSsml = require('./ssml/mutate-ssml');
const createTask = require('./speech/create-task');
const RequestException = require('./exception/Request');
const ConflictException = require('./exception/Conflict');
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

  if (body.id === undefined) {
    throw new RequestException('Mandatory request body property \'id\' is missing');
  }

  if (typeof body.id !== 'string') {
    throw new RequestException('Mandatory request body property \'id\' should be a string');
  }

  const id = body.id;

  if (body.encodedUrl === undefined) {
    throw new RequestException('Mandatory request body property \'encodedUrl\' is missing');
  }

  const encodedUrl = body.encodedUrl;

  if (!isBase64(encodedUrl)) {
    throw new RequestException('Mandatory request body property \'encodedUrl\' should be encoded as a base64 string');
  }

  const voice = body.voice;

  if (['Amy', 'Emma', 'Brian'].includes(voice) === false) {
    throw new RequestException('Mandatory request body property \'voice\' is missing');
  }

  const speed = body.speed;

  if ([120, 115, 110, 105, 100, 95, 90, 85, 80].includes(speed) === false) {
    throw new RequestException('Mandatory request body property \'speed\' is missing');
  }

  // attempt to retrieve existing article from id for idempotency check

  let existingArticle;

  try {
    existingArticle = await getArticleById(id);
  } catch (e) {}

  if (existingArticle) {
    throw new ConflictException('Conflict');
  }

  // attempt to retrieve existing article from encoded URL

  let encodedArticle;

  try {
    encodedArticle = await getArticleByEncodedUrl(encodedUrl);
  } catch (e) {}

  if (
    encodedArticle 
    && encodedArticle.pollyTaskStatus === 'COMPLETED' 
    && encodedArticle.s3ObjectAccessible === true 
    && encodedArticle.voice === voice 
    && encodedArticle.speed === speed
  ) {
    // create article

    let article;

    try {
      article = await createArticle(id, sessionId, encodedArticle);
    } catch (e) {
      throw e;
    }

    // we're done

    return { statusCode: 201, article };
  }

  // article has not been created previously, decode url

  const decodedUrl = Buffer.from(encodedUrl, 'base64').toString()
  
  if (!isValidHttpUrl(decodedUrl)) {
    throw new RequestException('Mandatory request body property \'encodedUrl\' should be a valid URL encoded as a base64 string');
  }

  // get url contents

  let html;

  try {
    html = await getHtmlFromUrl(decodedUrl);
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

  const {
    siteName,
    title
  } = content;

  // convert to ssml

  let ssml;

  try {
    ssml = getSsmlFromContent(content, speed);
  } catch (e) {
    throw new InternalException(e.message);
  }

  ssml = mutateSsml(decodedUrl, ssml);

  // create task

  let task;

  try {
    task = await createTask(ssml, voice);
  } catch (e) {
    throw e;
  }

  // create article

  let article;

  try {
    article = await createArticle(id, sessionId, {
      siteName,
      title,
      encodedUrl,
      decodedUrl,
      pollyTaskId: task.SynthesisTask.TaskId,
      pollyCharacterLength: task.SynthesisTask.RequestCharacters,
      pollyTaskStatus: task.SynthesisTask.TaskStatus.toUpperCase(),
      s3ObjectUrl: task.SynthesisTask.OutputUri,
      s3ObjectContentType: task.SynthesisTask.OutputFormat,
      s3ObjectAccessible: false,
      voice,
      speed
    });
  } catch (e) {
    throw e;
  }

  return { statusCode: 201, article };
};