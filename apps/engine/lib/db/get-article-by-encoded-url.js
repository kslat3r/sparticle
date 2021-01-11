const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');
const NotFoundException = require('../exception/NotFound');

const dynamoDb = new AWS.DynamoDB();

module.exports = async encodedUrl => {
  let response;

  try {
    response = await dynamoDb.query({
      TableName: 'articles',
      IndexName: 'encodedUrlIndex',
      KeyConditionExpression: 'encodedUrl = :encodedUrl',
      ExpressionAttributeValues: {
        ':encodedUrl': {
          'S': encodedUrl
        }
      }
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  if (!response || !response.Items.length) {
    throw new NotFoundException('Article not found');
  }
  
  return AWS.DynamoDB.Converter.unmarshall(response.Items[0]);
};