const AWS = require('aws-sdk');
const RequestException = require('../exceptions/RequestException');
const InternalException = require('../exceptions/InternalException');

const Polly = new AWS.Polly({
  signatureVersion: 'v4',
  region: 'eu-west-2'
});

module.exports = async (event) => {
  // validation
  
  if (event.pathParameters === undefined || event.pathParameters.id === undefined) {
    throw new RequestException('Mandatory path parameter \'id\' is missing');
  }

  // get task

  let task;
  
  try {
    task = await Polly.getSpeechSynthesisTask({ TaskId: event.pathParameters.id }).promise();
  } catch (e) {
    console.error(e);

    throw new InternalException(e.message);
  }

  return task;
};