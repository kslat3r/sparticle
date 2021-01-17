const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');

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
      SampleRate: '16000',
      OutputS3BucketName: 'sparticle-engine-prod-audio',
      SnsTopicArn: 'arn:aws:sns:eu-west-2:690524749915:sparticle-polly-task-updates'
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  return task;
}