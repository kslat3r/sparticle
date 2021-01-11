const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = async (id, sessionId, encodedUrl, decodedUrl, task) => {
  const article = {
    id,
    created: new Date().getTime(),
    sessionId,
    encodedUrl,
    decodedUrl,
    pollyTaskId: task.SynthesisTask.TaskId,
    pollyCharacterLength: task.SynthesisTask.RequestCharacters,
    s3ObjectUrl: task.SynthesisTask.OutputUri,
    s3ObjectContentType: task.SynthesisTask.OutputFormat
  };

  try {
    await dynamoDb.put({
      TableName: 'articles',
      Item: article,
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  return article;
};