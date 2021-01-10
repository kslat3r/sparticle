class RequestException extends Error {
  constructor(...params) {
    super(...params)

    this.httpStatusCode = 400;
  }
}

module.exports = RequestException;