const nodemailer = require("nodemailer");
const nodemailerKey = process.env.NODEMAILER_KEY;

  const transport = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 587,
    secure: false,
    auth : {
      user: "miturnoweb04@gmail.com",
      pass: "ykby evae jcgs dzmy",
    }
    
  });

//---------------------------------------------------> funcion y mensaje confirmacion de alta 
      // transport.sendMail({
      //   from:"rochilesde08@gmail.com",
      //   to:user.email,---> email de usuario 
      //   subject:"registration confirmation",
      //   text:"registration confirmation, role operator"
      // }); 
//--------------------------------------------------> funcion y mensaje confirmacion de turno 
      // transport.sendMail({
      //   from:"rochilesde08@gmail.com",
      //   to:user.email, ---> email de usuario 
      //   subject:"shift confirmation",
      //   text:"your confirmation of shif is for date"
      //   icalEvent: {
      //     filename: 'invitation.ics',
      //     method: 'request',
      //     content: content
      //    }
      // }); 
//---------------------------------------------------> funcion y mensaje recuperar contraseña 
      // transport.sendMail({
      //   from:"rochilesde08@gmail.com",
      //   to:user.email,---> email de usuario 
      //   subject:"registration confirmation",
      //   text:"Enter this link to recover your password"
      //   html: "<a href= "url para recuperar contraseña">recover password<a/>"
      // });

module.exports = {transport};