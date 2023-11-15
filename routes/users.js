const express = require("express");
const router = express.Router();
const Users = require("../models/Users");

// tus rutas aqui
// ... exitoooos! 😋

router.post("/register", (req, res) => {
  const { nameAndLast_name, DNI, email, password } = req.body;
  Users.findOne({ where: { email } }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ error: "El correo electrónico ya está registrado." });
    }
    return Users.create({ nameAndLast_name, DNI, email, password })
      .then((user) => {
        res.status(201).json({ redirectUrl: "/login" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor." });
      });
  });
});

module.exports = router;
