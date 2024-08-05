import express from "express";
import { userSignup, getAllUsers } from "../controllers/userController.js";
import { otp_sender, otp_verifier } from "../controllers/otpController.js";
import { createEnquiry } from "../controllers/enquiryController.js";
import {isUser} from "../middlewares/isLogin.js";

const router = express.Router();

router.get("/user", (req, res) => {
  res.send("Hello from user router");
});

router.post("/userSignup", userSignup);

//verify phone by 6 digit otp
router.route("/otp").post(otp_sender).put(otp_verifier);

// get all users
router.get("/users", getAllUsers);

// create enquiry
router.post("/user/enquiry", isUser, createEnquiry);
export default router;
