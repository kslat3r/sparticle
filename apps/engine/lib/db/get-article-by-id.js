const AWS = require('aws-sdk');
const InternalException = require('../exceptions/Internal');
const NotFoundException = require('../exceptions/NotFound');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = async id => {
  let response;

  try {
    response = await dynamoDb.get({
      TableName: 'articles',
      Key: {
        id
      }
    }).promise();
  } catch (e) {
    throw new InternalException(e.message);
  }

  if (!response || !response.Item) {
    throw new NotFoundException('Article not found');
  }
  
  return response.Item;
};