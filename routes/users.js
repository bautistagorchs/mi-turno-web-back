const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const Appointmen = require("../models/Appointment")
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
