const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler);

//Routes
const categoriesRoutes = require("./routes/categories");
const postsRoutes = require("./routes/post");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

const api = "/api";

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/post`, postsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

//Database
mongoose
  .connect("mongodb://localhost:27017/LostnFoundDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "LostnFoundDB",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
