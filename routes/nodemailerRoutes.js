const express = require("express");
const router = express.Router();
const {User, Branch} = require("../models");
const {transport} = require("../config/nodeMailer");
const {  generateTokenNodemailer,validateTokenNodemailer} = require("../config/tokenPassword")

router.post("/recoverEmailPassword/:email",(req,res)=>{
const useremail = req.params.email
console.log("datos del req.body =>",req.body)
User.findOne({where : {email: useremail}})
.then((resp)=>{

  if(!resp)res.status(404).json({ error: 'Usuario no encontrado' });

  if(resp){

    const payload = {
      fullname: resp.dataValues.fullname,
      email: resp.dataValues.email,
    };
    const token = generateTokenNodemailer(payload)

    transport.sendMail({
      from: "miturnoweb04@gmail.com",
      to: resp.dataValues.email,
      subject: "Recover Password",
      text: "Enter this link to recover your password",
      html: `<a href="http://localhost:3000/recoverPassword/${token}">Recover password</a>`
    },
     (error, info) => {
      if (error) {
        res.status(500).json({ error: 'Ocurrió un error al enviar el correo electrónico.' });
      } else {
        res.status(200).json({ message: 'Correo electrónico enviado con éxito.' });
      }
    })

  }
  console.log("respuesta del find one =>",resp)
})
.catch((error)=> error);

});

router.put("/recoverPassword/:token", (req,res)=>{
const token = req.params.token
const{ newPassword }= req.body
const info = validateTokenNodemailer(token)
if(!token) return res.sendStatus(401); 

console.log("RESPUESTA DE VALIDACION DE TOKEN =>",info)
console.log("CONTENIDO DEL BODY", req.body)

User.update( { password: newPassword },
{
  returning: true,
  where: { email: info.email },
  individualHooks: true
})
.then(([rowsUpdated, [updatedUser]]) => {
  if (rowsUpdated > 0) {
    console.log('Contraseña actualizada!');
    return res.sendStatus(202);
  }
})
.catch((err) => {
  console.error('Error al actualizar la contraseña:', err);
  return res.sendStatus(500);
});

})

router.post("/accountConfirmation/:email", (req, res)=>{
  const useremail = req.params.email
  console.log("datos del req.body =>",req.body)
  User.findOne({where : {email: useremail}})
  .then((resp)=>{
  
    if(!resp)return res.status(404).json({ error: 'Usuario no encontrado' });
    if(resp.dataValues.isConfirmed === true ) return res.status(401).json({ error: 'Usuario ya confirmado' });
    if(resp){
      const payload = {
        fullname: resp.dataValues.fullname,
        email: resp.dataValues.email,
      };
      const token = generateTokenNodemailer(payload)

        transport.sendMail({
        from: "miturnoweb04@gmail.com",
        to: resp.dataValues.email,
        subject:"Registration Confirmation",
        html: `<a href="http://localhost:3000/ConfirmationOfRegistration/${token}">Confirm Registration</a>`
      },
      (error, info) => {
       if (error) {
         res.status(500).json({ error: 'Ocurrió un error al enviar el correo electrónico.' });
       } else {
         res.status(200).json({ message: 'Correo electrónico enviado con éxito.' });
       }
     })
    }

})


});
router.put("/confirmation/:token", (req,res)=>{
  const token = req.params.token
  const info = validateTokenNodemailer(token)
  
  
  User.update( {  isConfirmed: true },
  {
    returning: true,
    where: { email: info.email },
    individualHooks: true
  })
  .then(([rowsUpdated, [updatedUser]]) => {
    if (rowsUpdated > 0) {
      console.log('registro confirmado!');
      return res.sendStatus(202);
    }
  })
  .catch((err) => {
    console.error('Error al confirmar registro:', err);
    return res.sendStatus(500);
  });
  
});

module.exports = router


