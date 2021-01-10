class NotFoundException extends Error {
  constructor(...params) {
    super(...params)

    this.httpStatusCode = 404;
  }
}

module.exports = NotFoundException;