import express from "express";
import isAdmin from "../middlewares/isLogin.js";

import {
    addBanner,
    getAllBanner,
    deleteBanner,
    activateAndDeactivateBanner,
    activeBanner
} from "../controllers/bannerController.js";

const router = express.Router();
import { upload } from "../middlewares/bucket.js";

router
    .route("/admin/banner")
    .post(isAdmin, upload.array("bannerImage", 1), addBanner)
    .get(isAdmin, getAllBanner);

// by id
router
    .route("/admin/banner/:id")
    .delete(isAdmin, deleteBanner)
    .put(isAdmin, activateAndDeactivateBanner);


router
    .route("/public/banner")
    .get(activeBanner);

export default router;
