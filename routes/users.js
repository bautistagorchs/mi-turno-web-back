const express = require("express");
const { User, Branch } = require("../models");
const router = express.Router();
const Appointment = require("../models/Appointment")
const { generateToken } = require("../config/tokens");
const { validateAuth } = require("../controllers/auth");
// tus rutas aqui
// ... exitoooos! 😋

//------------------------------------------------------------
//RUTA LOGIN

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({
    where: { email },
  }).then((user) => {
    if (!user) return res.sendStatus(401);

    user.validatePassword(password).then((isOk) => {
      if (!isOk) return res.sendStatus(401);
      const payload = {
        nameAndLast_name: user.nameAndLast_name,
        DNI: user.DNI,
        email,
      };
      const token = generateToken(payload);
      res.cookie("token", token).send(payload);
    });
  });
});

//RUTA DE AUTENTICACIÓN PARA LA PERSISTENCIA----------------------

router.get("/auth", validateAuth, (req, res) => {
  res.send(req.user);
});

//---------------------------------------------------------



// tus rutas aqui
// ... exitoooos! 😋


router.post("/register", (req, res) => {
  const { nameAndLast_name, DNI, email, password } = req.body;
  User.findOne({ where: { email } }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ error: "El correo electrónico ya está registrado." });
    }
    return User.create({ nameAndLast_name, DNI, email, password })
      .then((user) => {
        res.status(201).json({ redirectUrl: "/login" });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor." });
      });
  });
});


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





router.put("/removeOperator", (req, res) => {
  const { operatorId } = req.body;
  Branch.findOne({
    where: {
      operatorId: operatorId,
    },
  })
    .then((branch) => {
      if (branch) {
        return branch.setOperator(null);
      }
    })
    .then(() => {
      return User.destroy({
        where: {
          id: operatorId,
        },
      });
    })
    .then(() => {
      console.log("Se eliminó el operador");
      res.status(200).send("Operador eliminado con éxito");
    })
    .catch((error) => {
      console.error("Error al eliminar operador:", error);
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
  Appointment.create(req.body)
  .then((resp)=>{
    res.statusCode = 201
    res.send(resp)
  })
  .catch((error)=>console.log(error))
})





module.exports = router;
