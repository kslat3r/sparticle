module.exports = (statusCode, body) => ({
  statusCode,
  body: body !== undefined ? JSON.stringify(body) : undefined,
  headers: body !== undefined ? {
    'Content-Type': 'application/json'
  } : undefined
});