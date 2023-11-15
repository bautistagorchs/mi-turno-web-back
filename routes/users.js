const express = require("express");
const router = express.Router();
const Users = require("../models/Users");
const { generateToken } = require("../config/tokens");
const { validateAuth } = require("../controllers/auth");
// tus rutas aqui
// ... exitoooos! 😋

//------------------------------------------------------------
//RUTA LOGIN

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  Users.findOne({
    where: { email },
  }).then((user) => {
    if (!user) return res.sendStatus(401);

    user.validatePassword(password).then((isOk) => {
      if (!isOk) return res.sendStatus(401);
      const payload = {
        nameAndLast_name: user.nameAndLast_name,
        DNI: user.DNI,
        email,
      };
      const token = generateToken(payload);
      res.cookie("token", token).send(payload);
    });
  });
});

//RUTA DE AUTENTICACIÓN PARA LA PERSISTENCIA----------------------

router.get("/auth", validateAuth, (req, res) => {
  res.send(req.user);
});

//---------------------------------------------------------
module.exports = router;
