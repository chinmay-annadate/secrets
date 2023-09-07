//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/users");

const userSchema = new mongoose.Schema({
  uname: String,
  pass: String,
});

const User = mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("home");
});

app
  .route("/login")
  .get(function (req, res) {
    res.render("login");
  })
  .post(function (req, res) {
    User.findOne({ uname: req.body.username })
      .then((data) => {
        bcrypt.compare(req.body.password, data.pass, function (err, result) {
          if (result) {
            res.render("secrets");
          }
        });
      })
      .catch((e) => {
        console.log(e);
      });
  });

app
  .route("/register")
  .get(function (req, res) {
    res.render("register");
  })
  .post(function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      const newUser = new User({
        uname: req.body.username,
        pass: hash,
      });
      newUser.save().then(res.render("secrets"));
    });
  });

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
