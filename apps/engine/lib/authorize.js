const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const InternalException = require('./exception/Internal');

module.exports = () => {
  if (jwtConfig.secret === undefined || jwtConfig.secret === '') {
    throw new InternalException('Could not read JWT secret');
  }

  const sessionId = uuid.v4();
  const token = jwt.sign({ sessionId }, jwtConfig.secret);

  return { token };
};