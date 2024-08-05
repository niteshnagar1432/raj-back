import TripType from "../models/tripTypeModel.js";
import Package from "../models/packageModel.js";

export const addTripType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, error: "Trip type is required" });
    }

    const tripType = await TripType.create({
      name,
    });

    if (!tripType) {
      return res
        .status(400)
        .json({ success: false, message: "Error while adding trip type" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Trip type added successfully" });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getAllTripType = async (req, res) => {
  try {
    const tripType = await TripType.find().populate("packages").exec();
    if (!tripType) {
      return res
        .status(400)
        .json({ success: false, message: "Error while fetching trip type" });
    } else {
      return res.status(200).json({ success: true, tripType });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const getTripType = async (req, res) => {
  try {
    const tripType = await TripType.findById(req.params.id)
      .populate("packages")
      .exec();
    if (!tripType) {
      return res
        .status(400)
        .json({ success: false, message: "Error while fetching trip type" });
    } else {
      return res.status(200).json({ success: true, tripType });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const updateTripType = async (req, res) => {
  try {
    const { name } = req.body;
    const tripType = await TripType.findById(req.params.id);

    if (!tripType) {
      return res
        .status(400)
        .json({ success: false, message: "Trip type not found" });
    }

    tripType.name = name;
    await tripType.save();

    return res
      .status(200)
      .json({ success: true, message: "Trip type updated successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const deleteTripType = async (req, res) => {
  try {
    const tripType = await TripType.findById(req.params.id);

    if (!tripType) {
      return res
        .status(400)
        .json({ success: false, message: "Trip type not found" });
    }

    // filter out the deleted TripTypes from the package
    await Package.updateMany(
      { tripType: req.params.id },
      { $pull: { tripType: req.params.id } }
    );

    await tripType.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Trip type deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};
