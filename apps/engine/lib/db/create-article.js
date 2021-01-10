const AWS = require('aws-sdk');
const uuid = require('uuid');
const InternalException = require('../../exceptions/Internal');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = async (task, url) => {
  const article = {
    id: uuid.v4(),
    created: new Date().getTime(),
    articleUrl: url,
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