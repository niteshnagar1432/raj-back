import mongoose from "mongoose";
let { ObjectId } = mongoose.Types;

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  destinationImage: {
    type: String,
  },
  packages: [
    {
      type: ObjectId,
      ref: "Package",
    },
  ],
});

const Destination = mongoose.model("Destination", destinationSchema);

export default Destination;
