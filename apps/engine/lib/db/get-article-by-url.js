const AWS = require('aws-sdk');
const InternalException = require('../../exceptions/Internal');
const NotFoundException = require('../../exceptions/NotFound');

const dynamoDb = new AWS.DynamoDB();

module.exports = async url => {
  let response;

  try {
    response = await dynamoDb.query({
      TableName: 'articles',
      IndexName: 'articleUrlIndex',
      KeyConditionExpression: 'articleUrl = :articleUrl',
      ExpressionAttributeValues: {
        ':articleUrl': {
          'S': url
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