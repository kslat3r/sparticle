const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');
const UnauthorizedException = require('../exceptions/Unauthorized');

module.exports = event => {
  if (!event.headers || !event.headers.authorization) {
    throw new UnauthorizedException('Missing Authorization header');
  }

  const token = event.headers.authorization;
  let decoded;

  try {
    decoded = jwt.verify(token, jwtConfig.secret);
  } catch (e) {
    throw new UnauthorizedException('Could not decode authorization token');
  }

  if (decoded.sessionId === undefined || decoded.sessionId === '') {
    throw new UnauthorizedException('Could not get session ID from authorization token');
  }

  return decoded.sessionId;
};