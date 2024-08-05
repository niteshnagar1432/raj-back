import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema({
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

const ContactUs = mongoose.model("ContactUs", contactUsSchema);

export default ContactUs;