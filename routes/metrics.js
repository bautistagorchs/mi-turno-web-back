const express = require("express");
const router = express.Router();
const Metrics = require("../models/Metrics");

router.get("/all", (req, res) => {
  Metrics.findAll()
    .then((metrics) => res.status(200).send(metrics))
    .catch((err) => console.error(err));
});
module.exports = router;
