const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
const io = require("socket.io");
//change the database URL in the config file
const { mongoUri } = require("./helpers/config");

app.use(cors());
app.options("*", cors());

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

//Routes
const categoriesRoutes = require("./routes/categories");
const postsRoutes = require("./routes/post");
const usersRoutes = require("./routes/users");
//const pinsRoutes = require("./routes/Pins");
const chatRoutes = require("./routes/chat");
const searchAllRoutes = require("./routes/search-all");
const reportRoutes = require("./routes/report");
const requestRoutes = require("./routes/request");

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/posts`, postsRoutes);
app.use(`${api}/users`, usersRoutes);
//app.use(`${api}/pins`, pinsRoutes);
app.use(`${api}/chat`, chatRoutes);
app.use(`${api}/searchall`, searchAllRoutes);
app.use(`${api}/reports`, reportRoutes);
app.use(`${api}/requests`, requestRoutes);

//Database
// mongoose
//   .connect(mongoUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     dbName: "LostnFoundDB",
//   })
//   .then(() => {
//     console.log("Database Connection is ready...");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Database Connection is ready...");
    console.log(__dirname);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

//Server
// app.listen(3000, () => {
//   console.log("server is running http://localhost:3000");
// });
