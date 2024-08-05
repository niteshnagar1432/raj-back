import express from "express";
import {
  addReview,
  getAllReviewsByPackageId,
} from "../controllers/reviewController.js";
const router = express.Router();

router.route("/review/:packageId/:userId").post(addReview);

// get All Reviews by Package ID
router.route("/reviews/:packageId").get(getAllReviewsByPackageId);

export default router;
