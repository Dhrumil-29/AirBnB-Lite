const express = require("express");
const User = require("../models/user");
const userValidate = require("../validation/user");
const ExpressError = require("../utils/ExpressError");
const asyncWrap = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const {
  renderSignUp,
  registerUser,
  renderLogin,
  loginUser,
  logoutUser,
} = require("../controllers/user");

const router = express.Router();

// const validateUser = (req, res, next) => {
//   const { error } = userValidate.validate(req.body);
//   if (error) {
//     let errMess = error.details.map((el) => el.message).join(",");
//     next(new ExpressError(400, errMess));
//   } else {
//     next();
//   }
// };

router
  .route("/signup")
  .get(asyncWrap(renderSignUp))
  .post(asyncWrap(registerUser));

router
  .route("/login")
  .get(asyncWrap(renderLogin))
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    asyncWrap(loginUser)
  );

router.get("/logout", logoutUser);

router.use((req, res, next) => {
  res.render("layouts/notFound.ejs");
});

module.exports = router;
