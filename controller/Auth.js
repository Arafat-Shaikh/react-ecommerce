const { User } = require("../model/User");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { filterUser } = require("../services/common");

exports.signupUser = async (req, res) => {
  try {
    console.log(req.body.password);
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt }); //this will save user with hashed password using crypto library.
        const doc = await user.save();
        //signup doesn't automatically creates the session you have this block of code will help you to create session even after signup.
        req.login(filterUser(doc), (err) => {
          if (err) {
            res.status(401).json(err);
          } else {
            const token = jwt.sign(filterUser(doc), process.env.JWT_SECRET_KEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 7200000),
                httpOnly: true,
              })
              .status(201)
              .json(filterUser(doc));
          }
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(401).json("error");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = req.user;
    console.log("login user here" + JSON.stringify(user));
    res
      .cookie("jwt", user.token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
      })
      .status(201)
      .json(user);
  } catch (err) {
    console.log(err);
  }
};

exports.signOutUser = (req, res, next) => {
  res
    .cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200);
};

//this route is used for checking the session.
exports.checkUser = async (req, res) => {
  if (req.user) {
    res.status(201).json(req.user);
  } else {
    res.status(401).json("UnAuthorized");
  }
};
