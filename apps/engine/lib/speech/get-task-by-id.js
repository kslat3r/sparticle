const AWS = require('aws-sdk');
const InternalException = require('../../exceptions/Internal');

const polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'eu-west-2'
});

module.exports = async id => {
  let task;
  
  try {
    task = await polly.getSpeechSynthesisTask({ TaskId: id }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  return task;
};