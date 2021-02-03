const { setWorldConstructor } = require('@cucumber/cucumber');
const assert = require('assert');

class World {
  authorisationToken = null;
  articles = null;

  constructor (opts) {
    this.baseApiUrl = opts.parameters.baseApiUrl;

    assert.equal(typeof this.baseApiUrl, 'string');
  }

  setAuthorisationToken (token) {
    this.authorisationToken = token;
  }

  getAuthorisationToken () {
    return this.authorisationToken;
  }

  setArticles (articles) {
    this.articles = articles;
  }

  getArticles () {
    return this.articles;
  }
}

setWorldConstructor(World);