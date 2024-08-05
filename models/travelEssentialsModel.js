import mongoose from "mongoose";
// let { ObjectId } = mongoose.Types;

const travelEssentialsSchema = new mongoose.Schema(
  {
    html: {
      type: String,
    },
  },
  { timestamps: true }
);

const TravelEssentials = mongoose.model(
  "TravelEssential",
  travelEssentialsSchema
);

export default TravelEssentials;
