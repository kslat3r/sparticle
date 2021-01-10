const AWS = require('aws-sdk');
const InternalException = require('../../exceptions/Internal');

const polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'eu-west-2'
});

module.exports = async ssml => {
  let task;
  
  try {
    task = await polly.startSpeechSynthesisTask({
      Text: ssml,
      TextType: 'ssml',
      VoiceId: 'Amy',
      OutputFormat: 'mp3',
      OutputS3BucketName: 'sparticle-engine-prod-audio'
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  return task;
}