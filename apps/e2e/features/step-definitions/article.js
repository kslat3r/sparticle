const { When } = require('@cucumber/cucumber')
const axios = require('axios');
const assert = require('assert').strict;
const Article = require('../support/builders/article');

When('I create an article from URL {string} with voice {string} at speed {int}', async function (url, voice, speed) {
  assert.equal(typeof url, 'string');
  assert.equal(typeof voice, 'string');
  assert.equal(typeof speed, 'number');

  const article = new Article()
    .setEncodedUrl(Buffer.from(url).toString('base64'))
    .setVoice(voice)
    .setSpeed(speed);

  let response;

  try {
    response = await axios({
      url: `${this.baseApiUrl}/articles`,
      method: 'POST',
      headers: {
        authorization: this.getAuthorisationToken(),
        'content-type': 'application/json'
      },
      data: article.toRequestBody()
    })
  } catch (e) {
    assert.fail(e.message);
  }

  assert.equal(typeof response, 'object');
  assert.equal(typeof response.data, 'object');

  const newArticle = response.data;

  assert.equal(newArticle.decodedUrl, url);
  assert.equal(newArticle.encodedUrl, article.getEncodedUrl());
  assert.equal(newArticle.voice, article.getVoice());
  assert.equal(newArticle.speed, article.getSpeed());
});