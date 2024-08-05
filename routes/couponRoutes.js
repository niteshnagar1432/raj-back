import express from "express";

import isAdmin from "../middlewares/isLogin.js";
const router = express.Router();

import { addCoupon, getCoupons,getCouponById ,deleteCoupon, updateCoupon ,applyCoupon} from "../controllers/couponController.js";


router.route("/admin/coupon").post(isAdmin, addCoupon).get(getCoupons);
router.route("/admin/coupon/:id").get(getCouponById).delete(isAdmin, deleteCoupon).put(isAdmin, updateCoupon);
router.route("/coupon/apply").post(applyCoupon);
export default router;