const updateS3ObjectAcl = require('../lib/update-s3-object-acl');

module.exports = async event => {
  try {
    await updateS3ObjectAcl(event);
  } catch (e) {
    console.error(e);
  }
};