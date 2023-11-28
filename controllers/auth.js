const { validateToken } = require("../config/tokens");

function validateAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  const user = validateToken(token);

  if (!user) return res.sendStatus(401);
  req.user = user;

  next();
}

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
