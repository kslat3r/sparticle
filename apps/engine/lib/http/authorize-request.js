const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');
const InternalException = require('../exception/Internal');  
const UnauthorizedException = require('../exception/Unauthorized');

module.exports = event => {
  if (jwtConfig.secret === undefined || jwtConfig.secret === '') {
    throw new InternalException('Could not read JWT secret');
  }
  
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