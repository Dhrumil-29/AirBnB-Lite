const express = require("express");
const asyncWrap = require("../utils/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const { addReview, destroyReview } = require("../controllers/review");

const router = express.Router({ mergeParams: true });

router.post("/", isLoggedIn, validateReview, asyncWrap(addReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrap(destroyReview)
);

router.use((req, res, next) => {
  res.render("layouts/notFound.ejs");
});

module.exports = router;
