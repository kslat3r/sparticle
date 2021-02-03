const uuid = require('uuid');

class Article {
  id = null;
  encodedUrl = null;
  voice = null;
  speed = null;

  constructor () {
    this.id = uuid.v4();
  }

  setEncodedUrl (encodedUrl) {
    this.encodedUrl = encodedUrl;

    return this;
  }

  getEncodedUrl () {
    return this.encodedUrl;
  }

  setVoice (voice) {
    this.voice = voice;

    return this;
  }

  getVoice () {
    return this.voice;
  }

  setSpeed (speed) {
    this.speed = speed;

    return this;
  }

  getSpeed () {
    return this.speed;
  }

  toRequestBody () {
    return {
      id: this.id,
      encodedUrl: this.encodedUrl,
      voice: this.voice,
      speed: this.speed
    };
  }
}

module.exports = Article