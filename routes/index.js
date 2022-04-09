const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");
const Date = require("../models/form");
const User = require("../models/user");
const TempUser = require("../models/tempUser");

router.get("/", (req, res) => {
  res.render("welcome");
});

router.get("/register", (req, res) => {
  res.render("register");
});

//Chartai
router.get("/manageChart", ensureAuthenticated, async (req, res) => {
  res.render("manageChart", {
    user: req.user,
  });
});

//Datos
router.get("/manageDates", ensureAuthenticated, async (req, res) => {
  try {
    const date = await Date.find({}).lean();
    res.render("manageDates", {
      user: req.user,
      dateData: date,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("test");
  }
});

//Trinti datas
router.get("/date/delete/:id", ensureAuthenticated, (req, res) => {
  var id = req.params.id;
  console.log(id);
  try {
    Date.find({ date: id }).remove().exec();
  } catch (err) {
    console.log(err);
    res.status(500).send("test");
  }
  res.redirect("/manageDates");
});

//Useriai
router.get("/manageUsers", ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.find({}).lean();
    const tempUsers = await TempUser.find({}).lean();
    res.render("manageUsers", {
      user: req.user,
      userData: users,
      tempUserData: tempUsers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("test");
  }
});

//Trinti userius
router.get("/users/delete/:id", ensureAuthenticated, (req, res) => {
  var id = req.params.id;
  console.log(id);
  try {
    User.find({ email: id }).remove().exec();
  } catch (err) {
    console.log(err);
    res.status(500).send("test");
  }
  res.redirect("/manageUsers");
});

//Patvirtinti userius
router.get("/users/edit/:id", ensureAuthenticated, async (req, res) => {
  TempUser.findOne({ field_2: "Nodejs" })
    .then((doc) => {
      console.log(doc);
      User.insertMany([doc])
        .then((d) => {
          console.log("Saved Successfully");
        })
        .catch((error) => {
          console.log(error);
        });
      TempUser.deleteOne({ field_2: doc.field_2 })
        .then((d) => {
          console.log("Removed succesfully");
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});
module.exports = router;
