const express = require("express");
const router = express.Router();
const { Branch } = require("../models");

router.post("/", (req, res) => {
  Branch.findOrCreate({
    where: { email: req.body.email },
    defaults: req.body
  })
    .then(([branch, created]) => {
      if (!created) {
        branch.update(req.body)
          .then(() => {
            res.status(200).send("Se actualizó la información de la sucursal")
          })
      }
      else {
        res.status(200).send("Se creo la sucursal");
      }
    })
    .catch((err) => {
      console.error("Error al crear o actualizar la sucursal", err);
      res.sendStatus(500);
    });
});

router.get("/info/:id", (req, res) => {
  Branch.findOne({
    where: {
      id: req.params.id
    }
  })
    .then((branch) => {
      if (branch) {
        res.status(200).send(branch);
      } else {
        res.status(404).send("No se encontró la sucursal");
      }
    })
    .catch((error) => {
      console.error("No al buscar la sucursal", error);
      res.status(500).send("Error interno del servidor");
    })
})

router.get("/allBranches", (req, res) => {
  Branch.findAll()
    .then((branches) => res.status(200).send(branches))
    .catch((err) => console.error(err));
});
module.exports = router;
