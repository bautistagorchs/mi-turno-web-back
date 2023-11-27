const express = require("express");
const router = express.Router();
const users = require("./users");
const branches = require("./branches");
const nodemailer = require("./nodemailerRoutes")
router.get("/", (req, res) => {
  res.send("hello");
});

router.use("/users", users);
router.use("/branches", branches);
router.use("/nodeMailer", nodemailer);

router.use("/", (req, res) => res.sendStatus(404));

module.exports = router;
