import mongoose from "mongoose";
// let { ObjectId } = mongoose.Types;

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      default: null,
    },
    name : {
      type: String,
      default: null
    },
    email: {
      type: String,
      default: null,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
