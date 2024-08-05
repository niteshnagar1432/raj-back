import Review from "../models/reviewModel.js";
import Package from "../models/packageModel.js";

export const addReview = async (req, res) => {
  try {
    const { packageId, userId } = req.params;
    const { name, email, comment } = req.body;

    switch (true) {
      case !name:
        return res
          .status(400)
          .json({ success: false, message: "Name is required" });
      case !email:
        return res
          .status(400)
          .json({ success: false, message: "Email is required" });
      case !comment:
        return res
          .status(400)
          .json({ success: false, message: "Comment is required" });
    }

    const packageExist = await Package.findById(packageId);
    if (!packageExist) {
      return res
        .status(404)
        .json({ success: false, message: "Package not found" });
    }

    const review = new Review({
      user: userId,
      package: packageId,
      name,
      email,
      comment,
    });

    packageExist.reviews.push(review._id);

    await review.save();
    await packageExist.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAllReviewsByPackageId = async (req, res) => {
  try {
    const { packageId } = req.params;

    const reviews = await Review.find({ package: packageId });
    const packageExist = await Package.findById(packageId);

    if (!reviews) {
      return res.status(404).json({
        success: false,
        message: "Reviews not found",
      });
    }

    if (!packageExist) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reviews found",
      data: { reviews, packageExist },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
