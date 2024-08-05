import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";

export const userSignup = async (req, res) => {
  try {
    const { userName, email, password, phone } = req.body;

    switch (true) {
      case !userName:
        return res.status(400).json({ message: "Username is required" });
      case !email:
        return res.status(400).json({ message: "Email is required" });
      case !password:
        return res.status(400).json({ message: "Password is required" });
      case !phone:
        return res.status(400).json({ message: "Phone is required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = new User({
      userName,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};