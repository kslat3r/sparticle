class Exception500 extends Error {
  constructor(...params) {
    super(...params)

    this.httpStatusCode = 500;
  }
}

module.exports = Exception500;