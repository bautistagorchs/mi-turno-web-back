const express = require("express");
const router = express.Router();
const { Appointment, Branch } = require("../models");
const { findAll } = require("../models/Branch");

router.get("/confirmed/:branchId", (req, res) => {
  Appointment.findAll({
    where: { branchId: req.params.branchId },
    include: { model: Branch, as: "branch" },
  })
    .then((appointments) => res.status(200).send(appointments))
    .catch((err) => console.error(err));
});

router.put("/attended/:id", (req, res) => {
  const {id} = req.params
  Appointment.update( { attended : true },
    {
      returning: true,
      where: {reservationId: id },
      individualHooks: true
    })
    .then(([rowsUpdated, [updatedUser]]) => {
      if (rowsUpdated > 0) {
        console.log('Asistencia confirmada!');
        return res.sendStatus(202);
      }
    })
    .catch((err) => {
      console.error('Error al confirmar asistencia', err);
      return res.sendStatus(500);
    });
});

module.exports = router;


