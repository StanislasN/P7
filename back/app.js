const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("", require("./src/routes/postsRouting"));
app.use("", require("./src/routes/crudRouting"));
app.use("", require("./src/routes/authRouting"));

module.exports = app;
