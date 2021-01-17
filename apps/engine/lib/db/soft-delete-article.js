const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');
const NotFoundException = require('../exception/NotFound');

const dynamoDb = new AWS.DynamoDB();

module.exports = async article => {
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
      UpdateExpression: 'set deleted = :deleted',
      ExpressionAttributeValues: {
        ':id': {
          S: article.id,
        },
        ':deleted': {
          BOOL: true
        }
      },
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  return;
};