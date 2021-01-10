const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

module.exports = () => {
  const sessionId = uuid.v4();
  const token = jwt.sign({ sessionId }, jwtConfig.secret);

  return { token };
};