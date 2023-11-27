const express = require("express");
const router = express.Router();
const users = require("./users");
const branches = require("./branches");
const appointments = require("./appointments");
const nodemailer = require("./nodemailerRoutes");

router.get("/", (req, res) => {
  res.send("hello");
});

router.use("/users", users);
router.use("/branches", branches);
router.use("/appointments", appointments);
router.use("/nodeMailer", nodemailer);


router.use("/", (req, res) => res.sendStatus(404));

module.exports = router;
