const express = require("express");
const router = express.Router();
const UserModel = require("../models/users");
const bcrypt = require("bcryptjs");

/* GET users listing. */
router.get("/signup", async (req, res, next) => {
  res.render("template", {
    locals: {
      title: "Sign up",
      is_logged_in: req.session.is_logged_in
    },
    partials: {
      partial: "partial-signup"
    }
  });
});

router.get("/login", async (req, res, next) => {
  res.render("template", {
    locals: {
      title: "Login",
      is_logged_in: req.session.is_logged_in
    },
    partials: {
      partial: "partial-login"
    }
  });
});

router.post("/login", async function(req, res, next) {
  const { email, password } = req.body;

  const user = new UserModel(null, null, null, email, password);
  const loginResponse = await user.loginUser();
  console.log("login response is", loginResponse);

  if (!!loginResponse.isValid) {
    req.session.is_logged_in = loginResponse.isValid;
    req.session.users_id = loginResponse.user_id;
    req.session.first_name = loginResponse.first_name;
    req.session.last_name = loginResponse.last_name;
    res.redirect("/");
  } else {
    res.sendStatus(403);
  }
});

router.post("/signup", function(req, res, next) {
  const { first_name, last_name, password, email } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = new UserModel(null, first_name, last_name, email, hash);
  user.addUser();
  res.redirect("/");
});

router.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/");
});
module.exports = router;
