const AWS = require('aws-sdk');
const InternalException = require('../exceptions/Internal');
const NotFoundException = require('../exceptions/NotFound');

const dynamoDb = new AWS.DynamoDB();

module.exports = async sessionId => {
  let response;

  try {
    response = await dynamoDb.query({
      TableName: 'articles',
      IndexName: 'sessionIdIndex',
      KeyConditionExpression: 'sessionId = :sessionId',
      ExpressionAttributeValues: {
        ':sessionId': {
          'S': sessionId
        }
      }
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  const items = response.Items.map(item => AWS.DynamoDB.Converter.unmarshall(item));

  return items;
};