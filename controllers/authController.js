require("dotenv").config();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requirelogin");

class authController {
  signIn(req, res) {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(422).json({ error: "Fill all fields." });
    }
    User.findOne({ email: email })
      .then((savedUser) => {
        if (savedUser) {
          return res
            .status(422)
            .json({ error: "User with this email is already exists." });
        }

        bcrypt.hash(password, 12).then((hashedpassword) => {
          const user = new User({
            email,
            password: hashedpassword,
            name,
          });

          user
            .save()
            .then((user) => {
              res.json({ message: "saved successfully" });
            })
            .catch((error) => {
              console.log(error);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  signUp(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ error: "Write email or password" });
    }
    User.findOne({ email: email }).then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "No such user" });
      }

      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            // res.json({message:"successfully signed in"})
            const token = jwt.sign(
              { _id: savedUser._id },
              process.env.JWT_SECRET
            );
            const { _id, name, email, followers, following } = savedUser;
            res.json({
              token,
              user: { _id, name, email, followers, following },
            });
          } else {
            return res.status(422).json({ error: "Invalid Email or password" });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }
}

module.exports = new authController();
