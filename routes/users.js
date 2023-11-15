const express = require("express");
const { User, Branch } = require("../models");
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




router.put("/removeOperator", (req, res) => {
  const { operatorId } = req.body;
  Branch.findOne({
    where: {
      operatorId: operatorId,
    },
  })
    .then((branch) => {
      if (branch) {
        return branch.setOperator(null);
      }
    })
    .then(() => {
      return User.destroy({
        where: {
          id: operatorId,
        },
      });
    })
    .then(() => {
      console.log("Se eliminó el operador");
      res.status(200).send("Operador eliminado con éxito");
    })
    .catch((error) => {
      console.error("Error al eliminar operador:", error);
      res.status(500).send("Error interno del servidor");
    });
})

module.exports = router;
