const express = require("express");
const asyncWrap = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  destroyListing,
} = require("../controllers/listing");

const router = express.Router();
const multer = require("multer");

const { storage } = require("../cloudConfig");
const upload = multer({ storage });

//Index Router
router
  .route("/")
  .all((req, res, next) => {
    console.log(req.file);
    next();
  })
  .get(asyncWrap(index))
  .post(
    isLoggedIn,
    validateListing,
    upload.single("listing[image]"),
    asyncWrap(createListing)
  );

//New Router
router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(asyncWrap(showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    asyncWrap(updateListing)
  )
  .delete(isLoggedIn, isOwner, asyncWrap(destroyListing));

router.get("/:id/edit", isLoggedIn, isOwner, asyncWrap(renderEditForm));

router.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    req.flash("error", err);
    res.redirect(req.originalUrl);
  }
  next();
});

router.use("/", (req, res, next) => {
  res.render("layouts/notFound.ejs");
});

module.exports = router;
