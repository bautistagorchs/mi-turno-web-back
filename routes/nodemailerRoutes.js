const express = require("express");
const router = express.Router();
const { User, Branch } = require("../models");
const { transport } = require("../config/nodeMailer");
const {
  generateTokenNodemailer,
  validateTokenNodemailer,
} = require("../config/tokenPassword");

router.post("/recoverEmailPassword/:email", (req, res) => {
  const useremail = req.params.email;
  User.findOne({ where: { email: useremail } })
    .then((resp) => {
      if (!resp) res.status(404).json({ error: "Usuario no encontrado" });

      if (resp) {
        const payload = {
          fullname: resp.dataValues.fullname,
          email: resp.dataValues.email,
        };
        const token = generateTokenNodemailer(payload);

        transport.sendMail(
          {
            from: "miturnoweb04@gmail.com",
            to: resp.dataValues.email,
            subject: "Recuperación de Contraseña",
            text: "Solicistaste el cambio de contraseña",
            html: `
      <h3>Para el cambio de su Contraseña ingrese al siguiente enlace</h3>
      <h5>Recuerde que para efectuar el cambio solo tienes 10 minutos desde el envio de este Correo, transcurrido dicho tiempo sin haber ingresado al enlace y efectuar el cambio de su contraseña, este mismo enlace sera invalido!</h5>
      <a href="http://localhost:3000/recoverPassword/${token}">Recuperar Contraseña 🔑</a>
      `,
          },
          (error, info) => {
            if (error) {
              res.status(500).json({
                error: "Ocurrió un error al enviar el correo electrónico.",
              });
            } else {
              res
                .status(200)
                .json({ message: "Correo electrónico enviado con éxito." });
            }
          }
        );
      }
    })
    .catch((error) => error);
});

router.put("/recoverPassword/:token", (req, res) => {
  const token = req.params.token;
  const { newPassword } = req.body;
  const info = validateTokenNodemailer(token);
  if (!token) return res.sendStatus(401);

  User.update(
    { password: newPassword },
    {
      returning: true,
      where: { email: info.email },
      individualHooks: true,
    }
  )
    .then(([rowsUpdated, [updatedUser]]) => {
      if (rowsUpdated > 0) {
        return res.sendStatus(202);
      }
    })
    .catch((err) => {
      console.error("Error al actualizar la contraseña:", err);
      return res.sendStatus(500);
    });
});

router.post("/accountConfirmation/:email", (req, res) => {
  const useremail = req.params.email;
  User.findOne({ where: { email: useremail } }).then((resp) => {
    if (!resp) return res.status(404).json({ error: "Usuario no encontrado" });
    if (resp.dataValues.isConfirmed === true)
      return res.status(401).json({ error: "Usuario ya confirmado" });
    if (resp) {
      const payload = {
        fullname: resp.dataValues.fullname,
        email: resp.dataValues.email,
      };
      const token = generateTokenNodemailer(payload);

      transport.sendMail(
        {
          from: "miturnoweb04@gmail.com",
          to: resp.dataValues.email,
          subject: "Confirmación de Registro",
          html: `
        <h3>Para la confirmación de su cuenta ingrese al siguiente enlace </h3>
       <h5>Recuerde que para efectuar la confirmación de su cuenta solo dispone de 10 minutos desde el envio de este Correo, transcurrido dicho tiempo sin haber ingresado al enlace y efectuar la confirmacion de su cuenta este mismo enlace sera invalido y debera solicitar uno nuevamente desde el mismo!</h5>
        <a href="http://localhost:3000/account/confirm/${token}">Confirmar Registro ✔️</a>`,
        },
        (error, info) => {
          if (error) {
            res.status(500).json({
              error: "Ocurrió un error al enviar el correo electrónico.",
            });
          } else {
            res
              .status(200)
              .json({ message: "Correo electrónico enviado con éxito." });
          }
        }
      );
    }
  });
});
router.put("/confirmation/:token", (req, res) => {
  const token = req.params.token;
  const info = validateTokenNodemailer(token);

  User.update(
    { isConfirmed: true },
    {
      returning: true,
      where: { email: info.email },
      individualHooks: true,
    }
  )
    .then(([rowsUpdated, [updatedUser]]) => {
      if (rowsUpdated > 0) {
        return res.sendStatus(202);
      }
    })
    .catch((err) => {
      console.error("Error al confirmar registro:", err);
      return res.sendStatus(500);
    });
});

router.post("/appointment/confirmation", (req, res) => {
  const { email, branch, date, time } = req.body;
  transport.sendMail(
    {
      from: "Mi turno Web <miturnoweb04@gmail.com>",
      to: email,
      subject: "Turno confirmado! 📅",
      text: `Reservaste el turno exitosamente. La sucursal ${branch}, te espera el ${date} a las ${time}. Gracias por confiar en nosotros, que disfrutes tu visita!`,
      html: `<h2>Reservaste el turno exitosamente!</h2>
      <h3>Te esperamos en la sucursal ${branch} el ${date} a las ${time}.</h3>
      <h5>Gracias por confiar en nosotros, que disfrutes tu visita!</h5>`,
    },
    (error) => {
      if (error) {
        res.status(500).json({
          error: "Ocurrió un error al enviar el correo electrónico.",
        });
      } else {
        res
          .status(200)
          .json({ message: "Correo electrónico enviado con éxito." });
      }
    }
  );
});
router.post("/appointment/cancellation", (req, res) => {
  const { email, branch, date, time } = req.body;
  transport.sendMail(
    {
      from: "Mi turno Web <miturnoweb04@gmail.com>",
      to: email,
      subject: "Turno cancelado!",
      text: `Su turno en la sucursal ${branch}, el dia ${date} a las ${time} se ha cancelado exitosamente. Esperamos que solicite un nuevo turno a la brebedad`,
      html: `<h2>Se ha cancelado el turno exitosamente!</h2>
      <h3>Su turno en la sucursal ${branch}, el dia ${date} a las ${time} se ha cancelado exitosamente. Esperamos que solicite un nuevo turno a la brebedad.</h3>
      <h5>Gracias por confiar en nosotros, esperamos verle pronto!</h5>`,
    },
    (error) => {
      if (error) {
        res.status(500).json({
          error: "Ocurrió un error al enviar el correo electrónico.",
        });
      } else {
        res
          .status(200)
          .json({ message: "Correo electrónico enviado con éxito." });
      }
    }
  );
});
router.post("/appointment/EditConfirmation", (req, res) => {
  const { email, branch, date, time } = req.body;
  transport.sendMail(
    {
      from: "Mi turno Web <miturnoweb04@gmail.com>",
      to: email,
      subject: "Turno Modificado! 📅",
      text: `Modificaste el turno exitosamente. La sucursal ${branch}, te espera el ${date} a las ${time}. Gracias por confiar en nosotros, que disfrutes tu visita!`,
      html: `<h2>Modificaste el turno exitosamente!</h2>
      <h3>Te esperamos en la sucursal ${branch} el ${date} a las ${time}.</h3>
      <h5>Gracias por confiar en nosotros, que disfrutes tu visita!</h5>`,
    },
    (error) => {
      if (error) {
        res.status(500).json({
          error: "Ocurrió un error al enviar el correo electrónico.",
        });
      } else {
        res
          .status(200)
          .json({ message: "Correo electrónico enviado con éxito." });
      }
    }
  );
});

module.exports = router;
