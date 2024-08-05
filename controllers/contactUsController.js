import ContactUs from "../models/contactUsModel.js";

export const addContactUs = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
    
        if (!name) {
        return res
            .status(400)
            .json({ success: false, error: "Name is required" });
        }
        if (!email) {
        return res
            .status(400)
            .json({ success: false, error: "Email is required" });
        }
        if (!phone) {
        return res
            .status(400)
            .json({ success: false, error: "Phone is required" });
        }
        if (!message) {
        return res
            .status(400)
            .json({ success: false, error: "Message is required" });
        }
    
        const contactUs = await ContactUs.create({
        name,
        email,
        phone,
        message,
        });
    
        if (!contactUs) {
        return res
            .status(400)
            .json({ success: false, message: "Error while adding contact us" });
        } else {
        return res
            .status(200)
            .json({ success: true, message: "Contact us added successfully" });
        }
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: "Something went wrong please try again",
        error,
        });
    }
    }

export const getAllContactUs = async (req, res) => {
    try {
        const contactUs = await ContactUs.find();
        if (!contactUs) {
            return res
                .status(400)
                .json({ success: false, message: "Error while fetching contact us" });
        } else {
            return res.status(200).json({ success: true, contactUs });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong please try again",
            error,
        });
    }
}

export const deleteContactUs = async (req, res) => {
    try {
        const contactUs = await ContactUs.findById(req.params.id);
        if (!contactUs) {
            return res
                .status(404)
                .json({ success: false, message: "Contact us not found" });
        }
        await contactUs.deleteOne();
        return res
            .status(200)
            .json({ success: true, message: "Contact us deleted successfully" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong please try again",
            error,
        });
    }
}
