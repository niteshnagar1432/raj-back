import Banner from '../models/bannerModel.js';
import { deleteImageFromS3, uploadFileToS3 } from "../middlewares/bucket.js";

export const addBanner = async (req, res) => {
    try {
        const { externalLink } = req.body;
        if (!req.files[0]) {
            return res
                .status(400)
                .json({ success: false, error: "Banner Image is required" });
        }
        const bannerImage = await uploadFileToS3(req.files[0]);
        const banner = await Banner.create({
            bannerImage: bannerImage.Location,
            externalLink,
        });

        if (!banner) {
            return res
                .status(400)
                .json({ success: false, message: "Error while adding banner" });
        } else {
            return res
                .status(200)
                .json({ success: true, message: "Banner added successfully" });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong please try again",
            error,
        });
    }
}

export const getAllBanner = async (req, res) => {
    try {
        const banner = await Banner.find();
        if (!banner) {
            return res
                .status(400)
                .json({ success: false, message: "Error while fetching banner" });
        } else {
            return res.status(200).json({ success: true, banner });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong please try again",
            error,
        });
    }
}

export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res
                .status(404)
                .json({ success: false, message: "Banner not found" });
        }
        await deleteImageFromS3(banner.bannerImage);
        await banner.deleteOne();
        return res
            .status(200)
            .json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong please try again",
            error,
        });
    }
}

export const activateAndDeactivateBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res
                .status(404)
                .json({ success: false, message: "Banner not found" });
        }
        banner.isActive = !banner.isActive;
        await banner.save();
        return res
            .status(200)
            .json({ success: true, message: "Banner updated successfully" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong please try again",
            error,
        });
    }
}

export const activeBanner = async (req, res) => {
    try {
        const banner = await Banner.find({ isActive: true });
        if (!banner) {
            return res
                .status(400)
                .json({ success: false, message: "Error while fetching banner" });
        } else {
            return res.status(200).json({ success: true, banner });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong please try again",
            error,
        });
    }
}
