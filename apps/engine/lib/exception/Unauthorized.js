class UnauthorizedException extends Error {
  constructor(...params) {
    super(...params)

    this.httpStatusCode = 401;
  }
}

module.exports = UnauthorizedException;