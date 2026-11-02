require("dotenv").config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
var createError = require("http-errors");

var quizzesRouter = require("./routes/quizzes");
var questionsRouter = require("./routes/questions");
const usersRouter = require("./routes/users");

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const cors = require("cors");

app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.use('/quizzes', quizzesRouter);
app.use('/question', questionsRouter);
app.use("/users", usersRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  res.json({
    message: err.message
  });
});

module.exports = app;
