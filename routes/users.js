const express = require("express");
const router = express.Router();
const Users = require("../models/Users");

// tus rutas aqui
// ... exitoooos! 😋

router.put("/edit/profile", (req, res) => {
  Users.update(req.body, {
    returning: true,
    where: {
      email: req.body.email,
    },
  })
    .then(([affectedRows, response]) => res.status(202).send(response[0]))
    .catch((err) => console.error(err));
});
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.sendStatus(401);
});

module.exports = router;
