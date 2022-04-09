const express = require("express");
const router = express.Router();
const TempUser = require("../models/tempUser");
const bcrypt = require("bcrypt");
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/login", (req, res, next) => {
  const { email } = req.body;
  if (email == "admin123@gmail.com") {
    passport.authenticate("local", {
      successRedirect: "/manageUsers",
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, next);
  } else if (email == "acc123@gmail.com") {
    passport.authenticate("local", {
      successRedirect: "/manageChart",
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, next);
  } else {
    passport.authenticate("local", {
      successRedirect: "/manageDates",
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, next);
  }
});

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  console.log(" Name: " + name + " email:" + email + " pass:" + password);
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Iveskite visus langus" });
  }
  if (password !== password2) {
    errors.push({ msg: "Slaptazodziai nesutampa" });
  }
  if (password.length < 6) {
    errors.push({ msg: "Slaptazodis turetu buti bent 6 simboliu" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors: errors,
      name: name,
      email: email,
      password: password,
      password2: password2,
    });
  } else {
    TempUser.findOne({ email: email }).exec((err, user) => {
      console.log(user);
      if (user) {
        errors.push({ msg: "Sis pastas jau uzimtas" });
        res.render("register", { errors, name, email, password, password2 });
      } else {
        const newUser = new TempUser({
          name: name,
          email: email,
          password: password,
        });
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((value) => {
                console.log(value);
                req.flash("success_msg", "Jus prisiregistravote!");
                res.redirect("/users/login");
              })
              .catch((value) => console.log(value));
          })
        );
      }
    });
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "Atsijungete sekmingai");
  res.redirect("/users/login");
});

module.exports = router;
