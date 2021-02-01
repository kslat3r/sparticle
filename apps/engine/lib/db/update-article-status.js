const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');

const dynamoDb = new AWS.DynamoDB();

module.exports = async (article, status) => {
  try {
    await dynamoDb.updateItem({
      TableName: 'articles',
      Key: {
        sessionId: {
          S: article.sessionId
        },
        created: {
          N: article.created.toString()
        }
      },
      ConditionExpression: 'id = :id',
      UpdateExpression: 'set pollyTaskStatus = :pollyTaskStatus',
      ExpressionAttributeValues: {
        ':id': {
          S: article.id,
        },
        ':pollyTaskStatus': {
          S: status
        }
      },
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  return;
};