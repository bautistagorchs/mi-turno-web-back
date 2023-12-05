const express = require("express");
const router = express.Router();
const Branch = require("../models/Branch");
const User = require("../models/Users");
const Appointment = require("../models/Appointment");
const { generateToken } = require("../config/tokens");
const { validateAuth, validateRole } = require("../controllers/auth");
const { Op } = require("sequelize");

// tus rutas aqui
// ... exitoooos! 😋

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(406);

  User.findOne({
    where: { email },
  }).then((user) => {
    if (!user) return res.sendStatus(401);

    user.validatePassword(password).then((isOk) => {
      if (!isOk) return res.sendStatus(401);
      if (!user.isConfirmed)
        return res.status(401).send("Usuario no confirmado");
      const payload = {
        fullname: user.fullname,
        DNI: user.DNI,
        email,
        isAdmin: user.isAdmin,
        isOperator: user.isOperator,
        isConfirmed: user.isConfirmed,
      };
      const token = generateToken(payload);
      res.cookie("token", token).send(payload);
    });
  });
});

//RUTA DE AUTENTICACIÓN PARA LA PERSISTENCIA----------------------

router.get("/me", validateAuth, (req, res) => {
  res.send(req.user);
});

// RUTA DE REGISTRO DE USUARIOS ------------------------------------------

router.post("/register", validateRole, (req, res) => {
  const { fullname, DNI, email, password, isOperator, isAdmin, isConfirmed } =
    req.body;

  if (!email || !password || !fullname || !DNI)
    return res.status(406).json({ error: "No completo todos los campos" });

  if (!req.user && (isOperator || isAdmin)) {
    return res
      .status(403)
      .json({ error: "No tienes permisos para agregar el rol proporcionado." });
  }

  User.findOne({ where: { email } }).then((user) => {
    if (user) {
      return res
        .status(400)
        .json({ error: "El correo electrónico ya está registrado." });
    }
    return User.create({
      fullname,
      DNI,
      email,
      password,
      isOperator,
      isAdmin,
      isConfirmed,
    })
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Error interno del servidor." });
      });
  });
});

router.get("/operators", (req, res) => {
  User.findAll({
    where: {
      isOperator: true,
    },
  })
    .then((operators) => res.status(200).send(operators))
    .catch((error) => {
      console.error("Error al obtener la lista de operadores:", error);
      res.status(500).send("Error interno del servidor");
    });
});

router.put("/admin/deleteOperator/:id", (req, res) => {
  Branch.findOne({
    where: {
      operatorId: req.params.id,
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
          id: req.params.id,
        },
      });
    })
    .then(() => {
      res.status(200).send("Operador eliminado con éxito");
    })
    .catch((error) => {
      console.error("Error al eliminar operador:", error);
      res.status(500).send("Error interno del servidor");
    });
});

router.put("/edit/profile", (req, res) => {
  User.update(req.body, {
    returning: true,
    where: {
      email: req.body.email,
    },
    individualHooks: true,
  })
    .then(([affectedRows, response]) => res.status(202).send(response[0]))
    .catch((err) => console.error(err));
});
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.sendStatus(200);
});

router.post("/operator", (req, res) => {
  User.findOrCreate({
    where: {
      [Op.or]: [{ email: req.body.email }, { DNI: req.body.DNI }],
    },
    defaults: req.body,
  })
    .then(([user, created]) => {
      if (user) {
        if (!created) {
          Branch.findOne({
            where: {
              operatorId: user.id,
            },
          })
            .then((branch) => {
              if(branch && branch.id != req.body.branchId)
                branch.setOperator(null);
            })
            .then(() => {
              user.update(req.body).then((updatedUser) => {
                Branch.findOne({
                  where: {
                    id: req.body.branchId,
                  },
                })
                  .then((branch) => {
                    branch.setOperator(updatedUser);
                  })
                  .then(() => {
                    res
                      .status(200)
                      .send("Se actualizó la información del operador");
                  });
              });
            });
        } else {
          Branch.findOne({
            where: {
              id: req.body.branchId,
            },
          })
            .then((branch) => {
              branch.setOperator(user);
            })
            .then(() => {
              res.status(200).send("Se creó el operador");
            });
        }
      }
    })
    .catch((err) => {
      console.error("Error al crear o actualizar el operador", err);
      res.status(500).send("Error interno del servidor");
    });
});

router.get("/operator/info/:DNI", (req, res) => {
  User.findOne({
    where: {
      DNI: req.params.DNI,
    },
  })
    .then((user) => {
      if (user) {
        Branch.findOne({
          where: {
            operatorId: user.id,
          },
          include: [
            {
              model: User,
              as: "operator",
            },
          ],
        })
          .then((branchAndOp) => {
            if (branchAndOp) res.status(200).send(branchAndOp);
            else {
              res.status(200).send({
                //enviar operador sin branch
                operator: user,
              });
            }
          })
          .catch((err) => {
            res.status(404).send("No se encontró el operador");
          });
      }
    })
    .catch((error) => {
      console.error("Error al buscar el operador", error);
      res.status(500).send("Error interno del servidor");
    });
});

router.post("/newAppointment", (req, res) => {
  User.update(
    { telephone: req.body.telephone },
    {
      where: { email: req.body.email },
      returning: true,
      plain: true,
    }
  )
    .then((user) => {
      if (user[0] === 0 || !user[1])
        return res.status(404).json({ error: "no such user in database" });

      Appointment.create({
        branchId: req.body.branchId,
        date: req.body.date,
        schedule: req.body.schedule,
      })
        .then((appointment) => {
          appointment.setCreatedBy(user[1]);
          res.send(appointment);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log("no such user in database", error));
});

router.put("/newAppointment", (req, res) => {
  User.update(req.body, {
    where: { email: req.body.email },
    returning: true,
    plain: true,
  });
  Appointment.update(req.body, {
    where: {
      reservationId: req.body.reservationId,
    },

    returning: true,
  })
    .then((resp) => {
      res.statusCode = 201;
      res.send(resp);
    })
    .catch((error) => console.log(error));
});

router.put("/admin/deleteBranch/:id", (req, res) => {
  Appointment.destroy({
    where: {
      branchId: req.params.id,
    },
  })
    .then(() => {
      Branch.destroy({
        where: {
          id: req.params.id,
        },
      });
    })
    .then(() => {
      res.status(200).send("Se elimino la sucursal y las reservas asociadas");
    })
    .catch((err) => {
      res.status(500).send("Error interno del servidor");
    });
});

router.get("/appointment/:reservationId", (req, res) => {
  Appointment.findOne({
    where: {
      reservationId: req.params.reservationId,
    },
    include: [
      { model: User, as: "createdBy" },
      { model: Branch, as: "branch" },
    ],
  })
    .then((rsv) => {
      if (rsv) {
        res.status(200).send(rsv);
      } else {
        res.status(404).send("No se encontró la reserva");
      }
    })
    .catch((error) => {
      console.error("Error al obtener la reserva:", error);
      res.status(500).send("Error interno del servidor");
    });
});

router.delete("/removeAppointment/:reservationId", (req, res) => {
  Appointment.destroy({
    where: {
      reservationId: req.params.reservationId,
    },
  })
    .then(() => {
      res.status(204).send("Se removió la reserva");
    })
    .catch((error) => {
      console.error("Error al eliminar la reserva:", error);
      res.status(500).send("Error interno del servidor");
    });
});

router.get("/appointmentList/:DNI", (req, res) => {
  User.findOne({
    where: {
      DNI: parseInt(req.params.DNI),
    },
  })
    .then((user) => {
      Appointment.findAll({
        where: {
          userId: user.id,
        },
        include: [{ model: Branch, as: "branch" }],
      }).then((list) => {
        if (list) {
          res.status(200).send(list);
        } else {
          res.status(404).send("No se encontró la reserva");
        }
      });
    })
    .catch((error) => {
      console.error("Error al buscar las reserva:", error);
      res.status(500).send("Error interno del servidor");
    });
});

router.get("/operator/reservationsList/:DNI", (req, res) => {
  User.findOne({
    where: {
      DNI: req.params.DNI,
    },
  }).then((user) => {
    Branch.findOne({
      where: {
        operatorId: user.id,
      },
    }).then((branch) => {
      Appointment.findAll({
        where: {
          branchId: branch.id,
        },
        include: [
          { model: User, as: "createdBy" },
          { model: Branch, as: "branch" },
        ],
      })
        .then((reservationList) => {
          res.status(200).send(reservationList);
        })
        .catch((error) => {
          console.error("Error al buscar la lista de reservas:", error);
          res.status(500).send("Error interno del servidor");
        });
    });
  });
});

router.get("/admin/sucursalesList", (req, res) => {
  //trae sucursales con o sin operador
  Branch.findAll({
    include: [{ model: User, as: "operator" }],
  })
    .then((branches) => {
      res.status(200).send(branches);
    })
    .catch((error) => {
      console.error("Error al buscar la lista sucursales", error);
      res.status(500).send("Error interno del servidor");
    });
});

router.get("/admin/operatorsList", (req, res) => {
  User.findAll({
    where: {
      isOperator: true,
    },
  })
    .then((operators) => {
      const all = operators.map((op) => {
        const opb = { ...op.toJSON() };
        return Branch.findOne({ where: { operatorId: op.id } }).then((b) => {
          opb.branchInfo = b;
          return opb;
        });
      });

      return Promise.all(all);
    })
    .then((allOperators) => {
      res.status(200).send(allOperators);
    })
    .catch((error) => {
      res.status(500).send("Error interno del servidor");
    });
});

router.get("/edit/profile/:email", (req, res) => {
  User.findOne({ where: { email: req.params.email } }).then((result) => {
    res.status(200).send(result);
  });
});
router.delete("/delete", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
    
      Appointment.destroy({
        where:{userId:user.dataValues.id}
      })
      .then((resp)=>{
        User.destroy({
          where: {
            email: req.body.email,
          }
        })
        .then((resp)=>res.sendStatus(204))
        .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));

    })
    .catch((err) => console.error(err));
});

module.exports = router;
