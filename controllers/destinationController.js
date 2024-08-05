import Destination from "../models/destinationModel.js";
import Package from "../models/packageModel.js";
import { deleteImageFromS3, uploadFileToS3 } from "../middlewares/bucket.js";

export const addDestination = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, error: "Destination is required" });
    }
    if (!req.files[0]) {
      return res
        .status(400)
        .json({ success: false, error: "Destination Image is required" });
    }

    const destinationImage = await uploadFileToS3(req.files[0]);
    console.log(destinationImage)
    const destination = await Destination.create({
      name,
      destinationImage: destinationImage.Location,
    });

    if (!destination) {
      return res
        .status(400)
        .json({ success: false, message: "Error while adding destination" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Destination added successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getAllDestination = async (req, res) => {
  try {
    const destination = await Destination.find().populate("packages").exec();
    if (!destination) {
      return res
        .status(400)
        .json({ success: false, message: "Error while fetching destination" });
    } else {
      return res.status(200).json({ success: true, destination });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate("packages")
      .exec();
    if (!destination) {
      return res
        .status(400)
        .json({ success: false, message: "Error while fetching destination" });
    } else {
      return res.status(200).json({ success: true, destination });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const updateDestination = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, error: "Destination is required" });
    }
    if (req.files[0]) {
      if (req.body.destinationImage) {
        await deleteImageFromS3(req.body.destinationImage);
      }
      const destinationImage = await uploadFileToS3(req.files[0]);
      req.body.destinationImage = destinationImage.Location;
    }
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    if (!destination) {
      return res
        .status(400)
        .json({ success: false, message: "Error while updating destination" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Destination updated successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res
        .status(400)
        .json({ success: false, message: "Error while deleting destination" });
    } else {
      await deleteImageFromS3(destination.destinationImage);
      return res
        .status(200)
        .json({ success: true, message: "Destination deleted successfully" });
    }
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
}
