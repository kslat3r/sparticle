class ConflictException extends Error {
  constructor(...params) {
    super(...params)

    this.httpStatusCode = 409;
  }
}

module.exports = ConflictException;