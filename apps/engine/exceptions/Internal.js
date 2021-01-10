class InternalException extends Error {
  constructor(...params) {
    super(...params)

    this.httpStatusCode = 500;
  }
}

module.exports = InternalException;