//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/users");

const userSchema = new mongoose.Schema({
  uname: String,
  pass: String,
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["pass"] });

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
        if (req.body.password === data.pass) {
          res.render("secrets");
        }
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
    const newUser = new User({
      uname: req.body.username,
      pass: req.body.password,
    });
    newUser.save().then(res.render("secrets"));
  });

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
