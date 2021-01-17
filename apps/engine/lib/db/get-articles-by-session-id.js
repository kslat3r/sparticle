const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');
const NotFoundException = require('../exception/NotFound');

const dynamoDb = new AWS.DynamoDB();

module.exports = async sessionId => {
  let response;

  try {
    response = await dynamoDb.query({
      TableName: 'articles',
      KeyConditionExpression: 'sessionId = :sessionId',
      ExpressionAttributeValues: {
        ':sessionId': {
          'S': sessionId
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