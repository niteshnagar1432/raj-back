import express from "express";
import isAdmin from "../middlewares/isLogin.js";
import {
  addTermsAndConditions,
  deleteTermsAndCondition,
  getAllTermsAndConditions,
  getTermsAndCondition,
  updateTermsAndCondition,
} from "../controllers/adminController.js";
const router = express.Router();

router
  .route("/t&c")
  .post(isAdmin, addTermsAndConditions)
  .get(getAllTermsAndConditions);

// by id
router
  .route("/t&c/:id")
  .get(getTermsAndCondition)
  .put(isAdmin, updateTermsAndCondition)
  .delete(isAdmin, deleteTermsAndCondition);

export default router;
