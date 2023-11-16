const express = require("express");
const router = express.Router();
const users = require("./users");
const branches = require("./branches");

router.get("/", (req, res) => {
  res.send("hello");
});

router.use("/users", users);
router.use("/branches", branches);

router.use("/", (req, res) => res.sendStatus(404));

module.exports = router;
