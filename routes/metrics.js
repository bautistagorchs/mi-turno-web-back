const express = require("express");
const router = express.Router();
const Metrics = require("../models/Metrics");

router.get("/all", (req, res) => {
  Metrics.findAll()
    .then((metrics) => res.status(200).send(metrics))
    .catch((err) => console.error(err));
});

router.get("/:branchId", (req, res) => {
  Metrics.findAll({
    wehre: {
      branchId: req.params.branchId,
    },
  })
    .then((metrics) => res.status(200).send(metrics))
    .catch((err) => console.error(err));
});

router.post("/new", (req, res) => {
  Metrics.create(req.body)
    .then((metric) => res.status(200).send(metric))
    .catch((err) => console.error(err));
});

module.exports = router;
