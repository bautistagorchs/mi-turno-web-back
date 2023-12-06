const express = require("express");
const router = express.Router();
const Metrics = require("../models/Metrics");
const Branches = require("../models/Branch");

router.get("/", (req, res) => {
  if (req.query.branchName) {
    Branches.findOne({
      where: {
        name: req.query.branchName,
      },
    })
      .then((branch) => {
        Metrics.findAll({ where: { branchId: branch.id } })
          .then((metrics) => res.status(200).send(metrics))
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  } else
    Metrics.findAll()
      .then((metrics) => res.status(200).send(metrics))
      .catch((err) => console.error(err));
});

router.post("/new", (req, res) => {
  Metrics.create(req.body)
    .then((metric) => res.status(200).send(metric))
    .catch((err) => console.error(err));
});

module.exports = router;
