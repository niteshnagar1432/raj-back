import mongoose from "mongoose";
// let { ObjectId } = mongoose.Types;

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    subTitle: {
      type: String,
    },
    coverImage: {
      type: String,
    },

    backgroundImage: {
      type: String,
    },
    otherImages: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    html: {
      type: String,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
