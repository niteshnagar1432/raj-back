import express from "express";
import isAdmin from "../middlewares/isLogin.js";
import {
  addPaymentTerm,
  deletePaymentTerm,
  getAllPaymentTerm,
  getPaymentTermById,
  updatePaymentTerm,
} from "../controllers/adminController.js";
const router = express.Router();

router
  .route("/paymentTerm")
  .post(isAdmin, addPaymentTerm)
  .get(getAllPaymentTerm);

// by id
router
  .route("/paymentTerm/:id")
  .get(getPaymentTermById)
  .put(isAdmin, updatePaymentTerm)
  .delete(isAdmin, deletePaymentTerm);

export default router;
