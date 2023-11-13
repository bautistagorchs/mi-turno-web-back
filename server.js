const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./config/index");

app.use(express.json);
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

db.sync({ force: false })
  .then(() => {
    app.listen(3001, () =>
      console.log("Servidor levantado en el puerto 3001 👻")
    );
  })
  .catch((err) => console.error(err));
