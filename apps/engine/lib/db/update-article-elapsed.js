const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');

const dynamoDb = new AWS.DynamoDB();

module.exports = async (article, s3ObjectElapsed) => {
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
      UpdateExpression: 'set s3ObjectElapsed = :s3ObjectElapsed',
      ExpressionAttributeValues: {
        ':id': {
          S: article.id,
        },
        ':s3ObjectElapsed': {
          N: s3ObjectElapsed.toString()
        }
      },
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  return Object.assign({}, article, { s3ObjectElapsed });
};