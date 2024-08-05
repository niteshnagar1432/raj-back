import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Car from "../models/carModel.js";
import Blog from "../models/blogModel.js";
import Package from "../models/packageModel.js";
import Destination from "../models/destinationModel.js";

/*****************************AUTH ADMIN**************************/

export const adminSignup = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;
    if (!email || !password || !role || !username) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }
    const adminAlreadyExist = await Admin.findOne({ email: email });
    if (adminAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already registered" });
    }
    if (role === "admin") {
      return res
        .status(400)
        .json({ success: false, error: "Admin Already Registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const admin = await Admin.create({
      email: email,
      username: username,
      password: hashedPassword,
      role: role,
    });
    if (!admin) {
      return res
        .status(500)
        .json({ success: false, error: "Error while signing up the admin" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Admin Registered Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
};

export const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, error: "User is not registered" });
    }
    const matched = await bcrypt.compare(password, admin.password);
    if (!matched) {
      return res
        .status(400)
        .json({ success: false, error: "Incorrect Password" });
    }
    const role = admin.role;
    if (role === "admin" || role === "subAdmin") {
      const token = jwt.sign(
        { _id: admin._id },
        process.env.ACCESS_TOKEN_PRIVATE_KEY
      );
      return res.status(200).json({
        success: true,
        message: "Admin Logged In Successfully",
        token: token,
        data: admin,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: "You are not authorized to login as an admin",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Something went wrong please try again",
      error,
    });
  }
};

/************************************ CARS **************************/

export const getAllActiveCars = async (req, res) => {
  try {
    const cars = await Car.find({ status: "active" });
    if (!cars) {
      return res.status(400).json({ success: false, error: "No cars found" });
    }
    return res.status(200).json({ success: true, data: cars });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Something went wrong please try again",
      error,
    });
  }
};

/************************************ BLOGS **************************/

export const getAllActiveBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "active" });
    if (!blogs) {
      return res.status(400).json({ success: false, error: "No blogs found" });
    }
    return res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Something went wrong please try again",
      error,
    });
  }
};

/************************************ PACKAGES **************************/

export const getAllActivePackages = async (req, res) => {
  try {
    const packages = await Package.find({ status: "active" }).populate("destination")
      .populate("tripType")
      .populate("offer");
    if (!packages) {
      return res
        .status(400)
        .json({ success: false, error: "No packages found" });
    }
    return res.status(200).json({ success: true, data: packages });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Something went wrong please try again",
      error,
    });
  }
};

export const getPackagesByDestination = async (req, res) => {
  try {
    const destination = req.params.destination;
    const packages = await Package.find({
      destination
    }).populate("destination")
      .populate("tripType")
      .populate("offer");
    if (!packages) {
      return res
        .status(400)
        .json({ success: false, error: "No packages found" });
    }
    return res.status(200).json({
      success: true,
      message: "Packages fetched successfully",
      data: packages
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      error: "Something went wrong please try again",
      error,
    });
  }
}
/************************************ HOT DEALS **************************/

export const getAllHotDeals = async (req, res) => {
  try {
    const hotDeals = await Package.find({ hotDeals: true })
    .populate("destination")
    .populate("tripType")
    .populate("offer")
    
    ;
    if (!hotDeals) {
      return res
        .status(400)
        .json({ success: false, error: "No hot deals found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Hotdeals found successfully",
        data: hotDeals,
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Something went wrong please try again",
      error,
    });
  }
};

/************************************ All DESTINATION **************************/

export const getAllDestinationPublic = async (req, res) => {
  try {
    const destination = await Destination.find().populate("packages").exec();
    if (!destination) {
      return res
        .status(400)
        .json({ success: false, message: "Error while fetching destination" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Destination fetched successfully",
        data: destination
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong please try again",
      error,
    });
  }
}

