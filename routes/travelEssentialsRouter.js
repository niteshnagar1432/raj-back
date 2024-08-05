import express from "express";
import isAdmin from "../middlewares/isLogin.js";
import {
  addTravelEssentials,
  deleteTravelEssential,
  getAllTravelEssentials,
  getTravelEssential,
  updateTravelEssential,
} from "../controllers/adminController.js";
const router = express.Router();

router
  .route("/travelEssentials")
  .post(isAdmin, addTravelEssentials)
  .get(getAllTravelEssentials);

// by id
router
  .route("/travelEssentials/:id")
  .get(getTravelEssential)
  .put(isAdmin, updateTravelEssential)
  .delete(isAdmin, deleteTravelEssential);

export default router;
