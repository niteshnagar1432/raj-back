import Admin from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const isAdmin = async (req, res, next) => {
  var authHeader = req.headers.authorization;
  if (!authHeader)
    return res
      .status(401)
      .json({ success: false, error: "Authorization Required" });

  var token = authHeader.split(" ")[1];
  const decode = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);
  // console.log(decode);
  if (!decode)
    return res.json({ success: false, error: "Authentication failed" });
  else {
    const admin = await Admin.findOne({
      _id: decode._id,
    });

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, error: "Please Authenticate" });
    }

    req.token = token;
    req.admin = admin;

    next();
  }
};

export default isAdmin;

export const isUser = async (req, res, next) => {
  var authHeader = req.headers.authorization;
  if (!authHeader)
    return res
      .status(401)
      .json({ success: false, error: "Authorization Required" });

  var token = authHeader.split(" ")[1];
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decode);
  if (!decode)
    return res.json({ success: false, error: "Authentication failed" });
  else {
    const user = await User.findOne({
      _id: decode.user_id,
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Please Authenticate" });
    }

    req.token = token;
    req.user = user;

    next();
  }
}

