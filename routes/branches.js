const express = require("express");
const router = express.Router();
const { User, Branch } = require("../models");
const Appointment = require("../models/Appointment");

router.post("/newBranch", (req, res) => {
  Branch.create(req.body)
    .then((response) => res.status(201).send(response))
    .catch((err) => console.error(err));
});

router.get("/allBranches", (req, res) => {
  Branch.findAll()
    .then((branches) => res.status(200).send(branches))
    .catch((err) => console.error(err));
});
module.exports = router;
