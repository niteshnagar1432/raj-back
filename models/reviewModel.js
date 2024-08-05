import mongoose from "mongoose";
let { ObjectId } = mongoose.Types;

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    package: {
      type: ObjectId,
      ref: "Package",
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export default Review;
