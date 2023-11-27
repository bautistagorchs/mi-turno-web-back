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
module.exports = router;
