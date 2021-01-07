const AWS = require('aws-sdk');
const S3 = new AWS.S3();

module.exports = async (event) => {
  if (event.Records === undefined) {
    throw new Exception('Records property is missing');
  }

  const records = event.Records;

  if (!records.length) {
    throw new Exception('No records found');
  }

  const record = event.Records[0];
  const bucket = record.s3.bucket.name;
  const key = record.s3.object.key;

  console.log(bucket);
  console.log(key);

  try {
    await S3.putObjectAcl({
      Bucket: bucket,
      Key: key,
      GrantRead: 'uri=http://acs.amazonaws.com/groups/global/AllUsers'
    });
  } catch (e) {
    throw e;
  }
};