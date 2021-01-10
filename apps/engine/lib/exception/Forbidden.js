class ForbiddenException extends Error {
  constructor(...params) {
    super(...params)

    this.httpStatusCode = 403;
  }
}

module.exports = ForbiddenException;