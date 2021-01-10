const makeObjectPublic = require('./storage/make-object-public');

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

  try {
    await makeObjectPublic(bucket, key);
  } catch (e) {
    throw e;
  }
};