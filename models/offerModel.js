import mongoose from "mongoose";

const offerSchema = mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['percentage', 'price'],
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;