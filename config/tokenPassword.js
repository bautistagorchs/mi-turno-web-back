const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKeyPassword = process.env.SECRET_KEY_PASSWORD;

function generateTokenNodemailer(payload) {
  const token = jwt.sign(payload, secretKeyPassword, {expiresIn : "10m"});
  return token;
}

function validateTokenNodemailer(token) {
  const info = jwt.verify(token, secretKeyPassword);
  return info;
}

module.exports = {
  generateTokenNodemailer,
  validateTokenNodemailer,
};
