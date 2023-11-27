const express = require("express");
const router = express.Router();
const {User, Branch} = require("../models");
const {transport} = require("../config/nodeMailer");


router.post("/recoverEmailPassword/:email",(req,res)=>{
const email = req.params.email
transport.sendMail({
  from: "miturnoweb04@gmail.com",
  to: email,
  subject: "Recover Password",
  text: "Enter this link to recover your password",
  html: `<a href="http://localhost:3000/recoverPassword/${email}">Recover password</a>`
},
 (error, info) => {
  if (error) {
    res.status(500).json({ error: 'Ocurrió un error al enviar el correo electrónico.' });
  } else {
    res.status(200).json({ message: 'Correo electrónico enviado con éxito.' });
  }
});
});

router.put("/recoverPassword/:email", (req,res)=>{
const userEmail = req.params.email

User.update(req.body,{
  returning : true,
  where :{
    email : userEmail
  }, 
  individualHooks: true

})
.then(([responseOne, responseTwo]) => res.sendStatus(202))
.catch((err) => console.error(err));

})

router.post("/accountConfirmation/:email", (req, res)=>{



})
router.put("/confirmation/:email", (req,res)=>{

});

module.exports = router


