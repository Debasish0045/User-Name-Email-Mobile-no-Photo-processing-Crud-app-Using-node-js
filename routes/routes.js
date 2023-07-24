const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const fs = require("fs");

//image uploader
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("photo");

//insert an user into database route

router.post("/add", upload, (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    age: req.body.age,
    photo: req.file.filename,
  });
  user.save((err) => {
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "User added successfully!",
      };
      res.redirect("/");
    }
  });
});

//get all users route

router.get("/", (req, res) => {
  User.find().exec((err, users) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("index", {
        title: "Home Page",
        users: users,
      });
    }
  });
});

router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

//Edit an user route
router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id, (err, user) => {
    if (err) {
      res.redirect("/");
    } else {
      if (user == null) {
        res.redirect("/");
      } else {
        res.render("edit_users", {
          title: "Edit User",
          user: user,
        });
      }
    }
  });
});

//update user route
router.post("/update/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_photo = "";

  if (req.file) {
    new_photo = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_photo);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_photo = req.body.old_photo;
  }
  User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      age: req.body.age,
      photo: new_photo,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: "User updated successfully!",
        };
        res.redirect("/");
      }
    }
  );
});

//Delete user route
router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  User.findByIdAndRemove(id, (err, result) => {
    if (result.photo != "") {
      try {
        fs.unlinkSync("./uploads/" + result.photo);
      } catch (err) {
        console.log(err);
      }
    }
    if (err) {
      res.json({ message: err.message });
    } else {
      req.session.message = {
        type: "info",
        message: "User deleted successfully!",
      };
      res.redirect("/");
    }
  });
});

module.exports = router;
