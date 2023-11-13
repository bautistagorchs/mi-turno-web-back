const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json);
app.use(morgan("dev"));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

app.listen(3001, () => console.log("Servidor levantado en el puerto 3001 👻"));
