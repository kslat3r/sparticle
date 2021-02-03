const { Given } = require('@cucumber/cucumber')
const axios = require('axios');
const assert = require('assert').strict;

Given('I am an authenticed customer', async function () {
  let response;

  try {
    response = await axios({
      url: `${this.baseApiUrl}/authorize`,
      method: 'POST'
    });
  } catch (e) {
    assert.fail(e.message);
  }

  assert.equal(typeof response, 'object');
  assert.equal(typeof response.data, 'object');
  assert.equal(typeof response.data.token, 'string');
  
  this.setAuthorisationToken(response.data.token);
});