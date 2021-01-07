const AWS = require('aws-sdk');
const isBase64 = require('is-base64');
const isValidHttpUrl = require('is-valid-http-url');
const RequestException = require('../exceptions/RequestException');
const InternalException = require('../exceptions/InternalException');

const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'eu-west-2'
});

module.exports = async (event) => {
  // validation
  
  if (event.body === undefined) {
    throw new RequestException('Mandatory request body is missing');
  }

  let body;

  try {
    body = JSON.parse(event.body);
  } catch (e) {
    throw new RequestException('Mandatory request body is not valid JSON');
  }

  if (body.url === undefined) {
    throw new RequestException('Mandatory request body property \'url\' is missing');
  }

  let url = body.url;

  if (!isBase64(url)) {
    throw new RequestException('Mandatory request body property \'url\' should be encoded as a base64 string');
  }

  url = Buffer.from(url, 'base64').toString()
  
  if (!isValidHttpUrl(url)) {
    throw new RequestException('Mandatory request body property \'url\' should be a valid URL');
  }

  // get url contents

  // convert to ssml

  // check lengths against API limits

  // create task

  let task;
  
  try {
    task = await Polly.startSpeechSynthesisTask({
      Text: 'Hello from Ed\'s text-to-speech engine!',
      VoiceId: 'Russell',
      OutputFormat: 'mp3',
      OutputS3BucketName: 'sparticle-engine-prod-audio'
    }).promise();
  } catch (e) {
    console.error(e);

    throw new InternalException(e.message);
  }

  return task;
};