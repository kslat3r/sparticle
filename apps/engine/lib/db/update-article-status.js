const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');
const NotFoundException = require('../exception/NotFound');

const dynamoDb = new AWS.DynamoDB();

module.exports = async (article, pollyTaskStatus) => {
  let response;

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
          S: pollyTaskStatus
        }
      },
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  return;
};