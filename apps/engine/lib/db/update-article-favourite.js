const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');

const dynamoDb = new AWS.DynamoDB();

module.exports = async (article, favourite) => {
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
      UpdateExpression: 'set favourite = :favourite',
      ExpressionAttributeValues: {
        ':id': {
          S: article.id,
        },
        ':favourite': {
          BOOL: favourite
        }
      },
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  return Object.assign({}, article, { favourite });
};