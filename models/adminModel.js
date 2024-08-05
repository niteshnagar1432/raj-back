import mongoose from "mongoose";
// let { ObjectId } = mongoose.Types;

const adminSchema = new mongoose.Schema(
  {
    email: String,
    username: String,
    password: String,
    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
