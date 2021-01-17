const AWS = require('aws-sdk');
const InternalException = require('../exception/Internal');
const NotFoundException = require('../exception/NotFound');

const dynamoDb = new AWS.DynamoDB();

module.exports = async id => {
  let response;

  try {
    response = await dynamoDb.query({
      TableName: 'articles',
      IndexName: 'idIndex',
      KeyConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': {
          'S': id
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