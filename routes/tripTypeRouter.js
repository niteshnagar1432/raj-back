import express from "express";
import isAdmin from "../middlewares/isLogin.js";
import {
  addTripType,
  getAllTripType,
  getTripType,
  updateTripType,
  deleteTripType,
} from "../controllers/tripTypeController.js";
const router = express.Router();

router.route("/tripType").post(isAdmin, addTripType).get(getAllTripType);

// by id
router
  .route("/tripType/:id")
  .get(getTripType)
  .put(isAdmin, updateTripType)
  .delete(isAdmin, deleteTripType);

export default router;
