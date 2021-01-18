const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = async (id, sessionId, params) => {
  const article = Object.assign({}, params, {
    id,
    created: new Date().getTime(),
    sessionId,
    deleted: false,
  });

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