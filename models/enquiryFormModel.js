import mongoose from "mongoose";
let { ObjectId } = mongoose.Types;

const enquiryFormSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      reqired: true,
      ref: "User",
    },
    Packages: [
      {
        type: ObjectId,
        ref: "Package",
      },
    ],
    destination: {
      type: String,
      reqired: true,
    },
    StartDate: {
      type: Date,
      reqired: true,
    },
    noOfDays: {
      type: String,
      reqired: true,
    },
    noOfAdults: {
      type: Number,
      reqired: true,
    },
    noOfChildrenAbove6: {
      type: Number,
      reqired: true,
    },
    noOfChildrenBelow6: {
      type: Number,
      reqired: true,
    },
    travelByFlightOrTrain: {
      type: Boolean,
      required: true,
      default: false,
    },
    accomodationType: {
      type: String,
      required: true,
      enum: ["Hotel + Cab", "Hotel Only", "Cab Only"],
    },
    additionalInfo: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const EnquiryForm = mongoose.model("EnquiryForm", enquiryFormSchema);

export default EnquiryForm;
