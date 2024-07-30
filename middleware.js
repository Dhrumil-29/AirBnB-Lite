const Listing = require("./models/listing");
const listingValidate = require("./validation/listing");
const ExpressError = require("./utils/ExpressError");
const reviewValidate = require("./validation/review");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // redirect save
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    // redirect save
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author if this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
  const { error } = listingValidate.validate(req.body.listing);
  if (error) {
    let errMess = error.details.map((el) => el.message).join(",");
    next(new ExpressError(400, errMess));
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewValidate.validate(req.body.review);
  if (error) {
    let errMess = error.details.map((el) => el.message).join(",");
    next(new ExpressError(400, errMess));
  } else {
    next();
  }
};
