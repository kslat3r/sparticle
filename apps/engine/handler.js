const createTaskHandler = require('./handlers/create-task');
const getTaskHandler = require('./handlers/get-task');
const updateAudioAcl = require('./handlers/update-audio-acl');

module.exports.createTask = createTaskHandler;
module.exports.getTask = getTaskHandler;
module.exports.updateAudioAcl = updateAudioAcl;
