const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const posts_route = require("./api/routes/posts_route");
const transactions_route = require("./api/routes/transactions_route");
const rates_route = require("./api/routes/rates_route");
const post_types_route = require("./api/routes/post_types_route");

const provinceRoutes = require("./api/routes/provinces");
const districtRoutes = require("./api/routes/districts");
const accountRoutes = require("./api/routes/accounts");
const feedbackRoutes = require("./api/routes/feedbacks");

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// mongoose.connect('mongodb+srv://'
//   + process.env.MONGO_ATLAS_PW +
//   '@cluster0-n3imy.mongodb.net/dbcnpm?retryWrites=true&w=majority',
//   { useNewUrlParser: true, useUnifiedTopology: true }
// )

mongoose.connect(
  "mongodb+srv://lotus_dev:lotus123%23%23@cluster0-9glsf.mongodb.net/leb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

mongoose.Promise = global.Promise;

//router
app.use("/posts", posts_route);
app.use("/posttypes", post_types_route);
app.use("/transactions", transactions_route);
app.use("/rates", rates_route);

app.use("/provinces", provinceRoutes);
app.use("/districts", districtRoutes);
app.use("/accounts", accountRoutes);
app.use("/feedbacks", feedbackRoutes);

// app.use('/postspending',posts_route.)

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,PATH,POST,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
