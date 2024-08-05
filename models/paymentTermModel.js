import mongoose from "mongoose";
// let { ObjectId } = mongoose.Types;

const paymentTermSchema = new mongoose.Schema(
  {
    html: {
      type: String,
    },
  },
  { timestamps: true }
);

const PaymentTerm = mongoose.model("PaymentTerm", paymentTermSchema);

export default PaymentTerm;
