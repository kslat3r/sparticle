const updateAudioAcl = require('../lib/update-audio-acl');

module.exports = async event => {
  try {
    await updateAudioAcl(event);
  } catch (e) {
    console.error(e);
  }
};