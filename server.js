const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./config/index");
const routes = require("./routes/index");
const { Appointment, User, Branch } = require("./models/index");

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: [`GET`, `POST`, `DELETE`, `OPTIONS`],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api", routes);

db.sync({ force: false })
  .then(() => {
    app.listen(5432, () =>
      console.log("Servidor levantado en el puerto 3001 👻")
    );
  })
  .catch((err) => console.error(err));

module.exports = app;
