import mongoose from "mongoose";
// let { ObjectId } = mongoose.Types;

const termsAndConditionSchema = new mongoose.Schema(
  {
    html: {
      type: String,
    },
  },
  { timestamps: true }
);

const TermsAndCondition = mongoose.model(
  "TermsAndCondition",
  termsAndConditionSchema
);

export default TermsAndCondition;
