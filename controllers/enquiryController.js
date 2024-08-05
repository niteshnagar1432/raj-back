import EnquiryForm from "../models/enquiryFormModel.js";

export const createEnquiry = async (req, res) => {
  try {
    const {
      destination,
      StartDate,
      noOfDays,
      noOfAdults,
      noOfChildrenAbove6,
      noOfChildrenBelow6,
      travelByFlightOrTrain,
      accomodationType,
      additionalInfo,
    } = req.body;

    switch (true) {
      case !destination:
        return res.status(400).json({
          success: false,
          message: "Destination is required",
        });
      case !StartDate:
        return res.status(400).json({
          success: false,
          message: "StartDate is required",
        });
      case !noOfDays:
        return res.status(400).json({
          success: false,
          message: "noOfDays is required",
        });
      case !noOfAdults:
        return res.status(400).json({
          success: false,
          message: "noOfAdults is required",
        });
      case !noOfChildrenAbove6:
        return res.status(400).json({
          success: false,
          message: "noOfChildrenAbove6 is required",
        });
      case !noOfChildrenBelow6:
        return res.status(400).json({
          success: false,
          message: "noOfChildrenBelow6 is required",
        });
      case !accomodationType:
        return res.status(400).json({
          success: false,
          message: "accomodationType is required",
        });
    }

    const enquiry = new EnquiryForm({
      user: req.user._id,
      destination,
      StartDate,
      noOfDays,
      noOfAdults,
      noOfChildrenAbove6,
      noOfChildrenBelow6,
      travelByFlightOrTrain,
      accomodationType,
      additionalInfo,
    });

    await enquiry.save();

    res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      data: enquiry,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await EnquiryForm.find().populate("user");

    res.status(200).json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    const enquiry = await EnquiryForm.findByIdAndDelete(id);

    if (!enquiry) {
      return res.status(404).json({
        status: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
