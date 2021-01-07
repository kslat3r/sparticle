class Exception400 extends Error {
  constructor(...params) {
    super(...params)

    this.httpStatusCode = 400;
  }
}

module.exports = Exception400;