const { validateToken } = require("../config/tokens");

function validateAuth(req, res, next) {
  const token = req.cookies.token;
  console.log("token----------------> ", token);
  if (!token) return res.sendStatus(401);

  const user = validateToken(token);

  if (!user) return res.sendStatus(401);
  req.user = user;

  next();
}

function validateRole(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log("Token ----------> ", req.cookies);
    return res.status(401).json({ error: "No autorizado" });
  }

  const user = validateToken(token);

  if (!user || !user.isAdmin) {
    return res.sendStatus(403).json({ error: "No autorizado" });
  }

  req.user = user;

  next();
}

function validatePath(req, res, next) {
  if (!req.hostname || req.hostname !== "localhost") {
    return res
      .status(403)
      .json({ error: "Acceso no autorizado para registrar usuarios." });
  }

  next();
}

module.exports = { validateAuth, validateRole, validatePath };
