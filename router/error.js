const express = require("express");
const ExpressError = require("../utils/ExpressError");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log(access);
  if (access == "done") {
    res.send("Done...");
  } else {
    next(new ExpressError(500, "Something went wrong"));
  }
});

router.use((err, req, res, next) => {
  const { status = 500, message = "Some error occured" } = err;
  res.status(status).send(message);
});

module.exports = router;
