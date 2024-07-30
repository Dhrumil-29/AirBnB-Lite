const express = require("express");
const initialData = require("../init/data");
const Listing = require("../models/listing");

const router = express.Router();

router.get("/", (req, res) => {
  const { data } = initialData;
  Listing.deleteMany({}).then(() => {
    console.log("Deleted all data...");
    Listing.insertMany(data).then(() => {
      console.log("All Data Inserted");
    });
  });
  res.redirect("/listings");
});

router.get("/updateOwner", async (req, res) => {
  await Listing.deleteMany({});
  initialData.data = initialData.data.map((obj) => ({
    ...obj,
    owner: "66a387076ba2a43fd9d8b348",
  }));
  Listing.insertMany(initialData.data).then(() => {
    console.log("All Data Updated");
  });
  res.redirect("/listings");
});

router.use((req, res, next) => {
  res.render("layouts/notFound.ejs");
});

module.exports = router;
