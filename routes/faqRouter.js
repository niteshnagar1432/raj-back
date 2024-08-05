import express from "express";
import isAdmin from "../middlewares/isLogin.js";
import {
  addFAQ,
  deleteFAQ,
  getAllFAQ,
  getFAQ,
  updateFAQ,
} from "../controllers/adminController.js";
const router = express.Router();

router.route("/faq").post(isAdmin, addFAQ).get(getAllFAQ);

// by id
router
  .route("/faq/:id")
  .get(getFAQ)
  .put(isAdmin, updateFAQ)
  .delete(isAdmin, deleteFAQ);

export default router;
