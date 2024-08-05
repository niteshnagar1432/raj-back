import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    html: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Faq = mongoose.model("Faq", faqSchema);

export default Faq;
