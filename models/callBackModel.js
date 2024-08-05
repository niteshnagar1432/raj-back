import mongoose from "mongoose";

const callBackSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    message: {
        type: String,
    },
},
    {
        timestamps: true,
    }
);

const CallBack = mongoose.model("Callback", callBackSchema);

export default CallBack;