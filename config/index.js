const Sequelize = require("sequelize");
const db = new Sequelize(
  "postgres://equipo4plataforma5:ROav3VKHHuGssP9bGZPev1kAPgFZhnc7@dpg-clnpqn0fvntc73b60650-a.frankfurt-postgres.render.com/mi_turno_web",
  "equipo4plataforma5",
  "ROav3VKHHuGssP9bGZPev1kAPgFZhnc7",
  {
    host: "dpg-clnpqn0fvntc73b60650-a",
    dialect: "postgres",
    logging: false,
  }
);
db.authenticate()
  .then(() => {
    console.log("Conexion exitosa a la base de datos", db.config.database);
  })
  .catch((err) => {
    console.error("No se pudo conectar a la base de datos", err);
  });
module.exports = db;
