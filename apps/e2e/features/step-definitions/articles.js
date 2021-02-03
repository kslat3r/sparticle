const { When, Then } = require('@cucumber/cucumber')
const axios = require('axios');
const assert = require('assert').strict;

When('I retrieve all articles', async function () {
  let response;

  try {
    response = await axios({
      url: `${this.baseApiUrl}/articles`,
      method: 'GET',
      headers: {
        authorization: this.getAuthorisationToken()
      }
    })
  } catch (e) {
    assert.fail(e.message);
  }

  assert.equal(typeof response, 'object');
  assert.equal(typeof response.data, 'object');

  this.setArticles(response.data);
});

Then('the first article in the list should be from URL {string} with voice {string} at speed {int}', function (url, voice, speed) {
  const articles = this.getArticles();
  const firstArticle = articles[0];

  assert.equal(firstArticle.decodedUrl, url);
  assert.equal(firstArticle.voice, voice);
  assert.equal(firstArticle.speed, speed);
});