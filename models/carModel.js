import mongoose from "mongoose";
// let { ObjectId } = mongoose.Types;

const carSchema = new mongoose.Schema(
  {
    carName: {
      type: String,
    },
    carModel: {
      type: String,
    },
    carPrice: {
      type: Number,
    },
    carCapacity: {
      type: Number,
    },
    carImages: [
      {
        type: String,
      },
    ],
    status:{
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Car", carSchema);
