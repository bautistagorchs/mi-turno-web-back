const express = require("express");
const { User } = require("../models");
const router = express.Router();
const Appointmen = require("../models/Appointment")

// tus rutas aqui
// ... exitoooos! 😋

//traer info operadores para admin
router.get("/operators", (req, res) => {
  User.findAll(
    {
      where:
      {
        isOperator: true
      }
    })
    .then((operators) => res.status(200).send(operators))
    .catch((error) => {
      console.error("Error al obtener la lista de operadores:", error);
      res.status(500).send("Error interno del servidor");
    });
})



// tus rutas aqui
// ... exitoooos! 😋

router.post("/newOperator",(req,res)=>{
    User.create(req.body)
    .then((user)=>{
      res.statusCode = 201
      res.send(user)
    })
    .catch((error)=> console.log(error))
});

router.post("/newAppointment",(req,res)=>{
  Appointmen.create(req.body)
  .then((resp)=>{
    res.statusCode = 201
    res.send(resp)
  })
  .catch((error)=>console.log(error))
})


module.exports = router;
