const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');

const dynamoDb = new AWS.DynamoDB();

module.exports = async sessionId => {
  let response;

  try {
    response = await dynamoDb.query({
      TableName: 'articles',
      KeyConditionExpression: 'sessionId = :sessionId',
      FilterExpression : 'deleted = :deleted',
      ExpressionAttributeValues: {
        ':sessionId': {
          'S': sessionId
        },
        ':deleted': {
          BOOL: true
        }
      },
      ScanIndexForward: false
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  const items = response.Items.map(item => AWS.DynamoDB.Converter.unmarshall(item));

  return items;
};