import mongoose from "mongoose";
let { ObjectId } = mongoose.Types;

const tripTypeSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  packages: [
    {
      type: ObjectId,
      ref: "Package",
    },
  ],
});

const TripType = mongoose.model("TripType", tripTypeSchema);

export default TripType;
