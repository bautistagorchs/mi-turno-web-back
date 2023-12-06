const { validateToken } = require("../config/tokens");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

function validateAuth(req, res, next) {
  console.log(req.headers);
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }

  const token = JSON.parse(authorizationHeader.substring(7)); // Elimina "Bearer " del encabezado
  console.log(token);
  try {
    const decoded = jwt.verify(token, secretKey);

    // Puedes hacer otras verificaciones según tus necesidades
    // Por ejemplo, verificar si el usuario existe en la base de datos

    req.user = decoded; // Añade el usuario decodificado al objeto req

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
}

// function validateAuth(req, res, next) {
//   const token = req.cookies.token;
//   console.log(token);
//   if (!token) return res.sendStatus(401);

//   const user = validateToken(token);

//   if (!user) return res.sendStatus(401);
//   req.user = user;

//   next();
// }

function validateRole(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  const user = validateToken(token);

  if (!user || !user.isAdmin) {
    return res.sendStatus(403).json({ error: "No autorizado" });
  }

  req.user = user;

  next();
}

module.exports = { validateAuth, validateRole };
