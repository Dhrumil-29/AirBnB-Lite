const mongoose = require("mongoose");
const review = require("./review");
const Scheme = mongoose.Schema;

const listingSchema = new Scheme({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: { type: String },
    url: {
      type: String,
    },
  },
  price: {
    type: Number,
    default: 100,
    min: 0,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Scheme.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Scheme.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
