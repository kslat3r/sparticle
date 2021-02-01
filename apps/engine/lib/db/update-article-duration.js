const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');

const dynamoDb = new AWS.DynamoDB();

module.exports = async (article, duration) => {
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
      UpdateExpression: 'set s3ObjectDuration = :s3ObjectDuration',
      ExpressionAttributeValues: {
        ':id': {
          S: article.id,
        },
        ':s3ObjectDuration': {
          N: duration.toString()
        }
      },
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  return;
};