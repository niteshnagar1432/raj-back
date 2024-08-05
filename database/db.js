import mongoose from "mongoose";
import Admin from "../models/adminModel.js";

// Connect to MongoDB

const Connection = async (MONGODB_URL) => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("MongoDB Connected");
    initial();
  } catch (error) {
    console.log(error, "Error while connecting to database");
  }
};

const initial = async () => {
  const admin = await Admin.findOne({ _id: "658924d431c2cc43104a1932" });
  if (!admin) {
    const createdAdmin = await Admin.create({
      _id: "658924d431c2cc43104a1932",
      email: "admin@admin.com",
      password: "$2a$10$YF5mDaQoXP1FD5cXTr05xuW27oZaAgezb7/Yf6YEPG4t4PU4VkM72",
      role: "admin",
    });
  } else {
    return console.log("Admin already created");
  }
};

export default Connection;
