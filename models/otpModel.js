import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp_type: {
    type: String,
    enum: ["email", "phone"],
  },
  type_value: String,
  otp: String,
  createdAt: { type: Date, expires: "5m", default: Date.now }, // OTP expires in 5 minutes
});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;
