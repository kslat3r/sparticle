const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');
const NotFoundException = require('../exception/NotFound');

const dynamoDb = new AWS.DynamoDB();

module.exports = async (article, s3ObjectAccessible) => {
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
      UpdateExpression: 'set s3ObjectAccessible = :s3ObjectAccessible',
      ExpressionAttributeValues: {
        ':id': {
          S: article.id,
        },
        ':s3ObjectAccessible': {
          BOOL: s3ObjectAccessible
        }
      },
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  return;
};