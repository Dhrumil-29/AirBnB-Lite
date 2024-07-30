if (process.env.NODE_ENV != "production") {
  require("dotenv").config;
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const userRouter = require("./router/user");
const listingsRouter = require("./router/listings");
const reviewsRouter = require("./router/reviews");
const resetDataRouter = require("./router/resetData");
const errorRouter = require("./router/error");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airBnB");
}

main()
  .then(() => {
    console.log("Database Connected...");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const sessionOptions = {
  secret: "mysuperscretecode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings/:id/reviews", reviewsRouter);
app.use("/listings", listingsRouter);
app.use("/resetData", resetDataRouter);
app.use("/error", errorRouter);
app.use("/", userRouter);

// add middleware for not found pages

// app.use("*", (err, req, res, next) => {
//   console.log("from rout");
//   res.render("layouts/notFound.ejs");
// });

// app.use((err, req, res, next) => {
//   console.log(err, req, res, next);
// });

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});
