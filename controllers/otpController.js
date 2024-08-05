import axios from "axios";
import Otp from "../models/otpModel.js";
import User from "../models/userModel.js";
import JWT from "jsonwebtoken";

function otp_gen() {
  return Math.floor(100000 + Math.random() * 900000);
}

const sendOtpSms = async (phone, otp) => {
  const flow_id = process.env.MSG_FLOW_ID;
  const auth_key = process.env.MSG_AUTH_KEY;
  try {
    const response = await axios.post(
      "https://api.msg91.com/api/v5/flow/",
      {
        flow_id: flow_id,
        sender: "SSIPIC",
        mobiles: phone,
        otp: otp,
        VAR2: "VALUE 2",
      },
      {
        headers: {
          authkey: auth_key,
          "Content-Type": "application/JSON",
        },
      }
    );

    console.log("SMS sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending SMS:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to send SMS");
  }
};

export const otp_sender = async (req, res) => {
  const otp = otp_gen();
  try {
    const { type, value } = req.body;

    switch (type) {
      case "phone":
        const sms_res = await sendOtpSms(value, otp);
        console.log("sms-otp:", sms_res);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid type",
        });
    }

    const response = await Otp.create({
      otp_type: type,
      type_value: value,
      otp: otp,
    });
    // console.log(response);

    return res.status(201).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const otp_verifier = async (req, res) => {
  try {
    const { type, value, otp, email, name } = req.body;

    const found_otp = await Otp.findOne({
      otp_type: type,
      type_value: value,
      otp: otp,
    });

    const [isVerified, msg] = found_otp
      ? [true, "Verified"]
      : [false, "Not verified"];

    // if otp is verified, and if user is not found, create a new user and send token
    if (isVerified) {
      let user = await User.findOne({ phone: value });

      // if user not found, create a new user on the basis of phone number

      if (!user) {
        let payload = {
          phone: value,
        };
        if (email) {
          payload.email = email;
        }
        if (name) {
          payload.name = name;
        }
        user = await User.create(payload);
      }else{
        if(email){
          user.email = email;
        }
        if(name){
          user.name = name;
        }
      }
       

      

      await user.save();

      const token = JWT.sign({ user_id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({
        success: true,
        message: msg,
        isVerified,
        token,
        userId: user._id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: msg,
        isVerified,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      err: error.message,
    });
  }
};
