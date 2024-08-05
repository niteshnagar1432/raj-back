import CallBack from "../models/callBackModel.js";

export const addCallBack = async (req, res) => {
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
    
        const callBack = await CallBack.create({
        name,
        email,
        phone,
        message,
        });
    
        if (!callBack) {
        return res
            .status(400)
            .json({ success: false, message: "Error while adding call Back" });
        } else {
        return res
            .status(200)
            .json({ success: true, message: "call Back added successfully" });
        }
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: "Something went wrong please try again",
        error,
        });
    }
    }

export const getAllCallbacks = async (req, res) => {
    try {
        const callBacks = await CallBack.find();
        if (!callBacks) {
            return res
                .status(400)
                .json({ success: false, message: "Error while fetching call Backs" });
        } else {
            return res.status(200).json({ success: true, callBacks });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong please try again",
            error,
        });
    }
}

export const deleteCallBacks = async (req, res) => {
    try {
        const callBacks = await CallBack.findById(req.params.id);
        if (!callBacks) {
            return res
                .status(404)
                .json({ success: false, message: "call Back  not found" });
        }
        await callBacks.deleteOne();
        return res
            .status(200)
            .json({ success: true, message: "call Backs us deleted successfully" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong please try again",
            error,
        });
    }
}
