import express from "express";
import isAdmin from "../middlewares/isLogin.js";
import {
  addDestination,
  getAllDestination,
  getDestination,
  updateDestination,
  deleteDestination,
} from "../controllers/destinationController.js";
const router = express.Router();
import { upload } from "../middlewares/bucket.js";

router
  .route("/destination")
  .post(isAdmin, upload.array("destinationImage", 1), addDestination)
  .get(getAllDestination);

// by id
router
  .route("/destination/:id")
  .get(getDestination)
  .put(isAdmin,upload.array("destinationImage", 1), updateDestination)
  .delete(isAdmin, deleteDestination);

export default router;
