const axios = require('axios');

module.exports = async url => {
  let response;
  
  try {
    response = await axios.get(url);
  } catch (e) {
    throw e;
  }

  if (response.status !== 200) {
    throw new Exception('HTML could not be retrieved');
  }

  return response.data;
}