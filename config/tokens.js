const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

function generateToken(payload) {
  const token = jwt.sign(payload, secretKey);
  return token;
}

function validateToken(token) {
  const info = jwt.verify(token, secretKey);
  return info;
}

module.exports = {
  generateToken,
  validateToken,
};
