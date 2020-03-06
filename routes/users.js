const express = require("express");
const router = express.Router();
const UserModel = require("../models/users");
const bcrypt = require("bcryptjs");

/* GET users listing. */
router.get("/signup", async (req, res, next) => {
  res.render("template", {
    locals: {
      title: "Sign up"
    },
    partials: {
      partial: "partial-signup"
    }
  });
});

router.get("/login", async (req, res, next) => {
  res.render("template", {
    locals: {
      title: "Login"
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
    req.session.user_id = loginResponse.user_id;
    req.session.first_name = loginResponse.first_name;
    req.session.last_name = loginResponse.last_name;
    res.redirect(200, "/");
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
  res.status(200).redirect("/");
});

module.exports = router;
