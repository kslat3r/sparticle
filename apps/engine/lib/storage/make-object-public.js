const AWS = require('aws-sdk');
const S3 = new AWS.S3();

module.exports = async (bucket, key) => {
  try {
    await S3.putObjectAcl({
      Bucket: bucket,
      Key: key,
      GrantRead: 'uri=http://acs.amazonaws.com/groups/global/AllUsers'
    }).promise();
  } catch (e) {
    throw e;
  }
}