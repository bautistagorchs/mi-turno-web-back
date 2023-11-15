const express = require("express");
const { User } = require("../models");
const router = express.Router();


// tus rutas aqui
// ... exitoooos! 😋

//traer info operadores para admin
router.get("/operators", (req, res) => {
  User.findAll(
    {
      where:
      {
        isOperator: true
      }
    })
    .then((operators) => res.status(200).send(operators))
    .catch((error) => {
      console.error("Error al obtener la lista de operadores:", error);
      res.status(500).send("Error interno del servidor");
    });
})



module.exports = router;
