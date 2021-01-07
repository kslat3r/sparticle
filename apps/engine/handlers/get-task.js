const getTask = require('../lib/get-task');

module.exports = async event => {
  try {
    const task = await getTask(event);

    return {
      statusCode: 200,
      body: JSON.stringify(task)
    };
  } catch (e) {
    console.error(e);

    return {
      statusCode: e.httpStatusCode || 500,
      body: JSON.stringify({
        message: e.message
      })
    };
  }
};