import express from "express";
import isAdmin from "../middlewares/isLogin.js";
import {
  addCar,
  getCarById,
  getCars,
  deleteCar,
  updateCar,
} from "../controllers/adminController.js";
import {
  addPackage,
  deletePackage,
  getPackageById,
  getPackages,
  updatePackage,
  applyOfferToPackages,
  removeOfferFromPackages,
  getPakagesAccordingToOffer,
  updatePackageStatus,
  updateFeaturedPackages,
  updateRajasthaniPackages,
} from "../controllers/packageController.js";

import {
  createTestimonial,
  getTestimonials,
  deleteTestimonial,
  updateTestimonial,
  featuredTestimonial,
} from "../controllers/testimonialsController.js";

import {
  getEnquiries,
  deleteEnquiry,
} from "../controllers/enquiryController.js";
import { upload } from "../middlewares/bucket.js";
const router = express.Router();

router.get("/admin", isAdmin, (req, res) => {
  res.send("Hello from admin router");
});

// ================================= CAR ROUTES ================================

router
  .route("/admin/car")
  .post(isAdmin, upload.array("carImages", 5), addCar)
  .get(getCars);

// get car by id
router.get("/admin/car/:id", getCarById);

// delete car by id
router.delete("/admin/car/:id", deleteCar);

// update car by id
router.put("/admin/car/:id", isAdmin, upload.array("carImages", 5), updateCar);

// ============================== END OF CAR ROUTES ==============================

// ============================== PACKAGE ROUTES =================================

router
  .route("/admin/package")
  .post(isAdmin, upload.array("galleryImages", 5), addPackage)
  .get(getPackages);

// by id
router
  .route("/admin/package/:id")
  .get(getPackageById)
  .put(isAdmin, upload.array("galleryImages", 5), updatePackage)
  .delete(isAdmin, deletePackage);

// update package status
router.put("/admin/status/package", isAdmin, updatePackageStatus);

//  update featured packages
router.put("/admin/featured/package", isAdmin, updateFeaturedPackages);

//  update rajasthani packages
router.put("/admin/rajasthani/package", isAdmin, updateRajasthaniPackages);

// ============================== END OF PACKAGE ROUTES ===========================

// ============================== OFFER ROUTES ===================================
router.route("/admin/offer/packages").post(isAdmin, applyOfferToPackages);
router.route("/admin/offer/remove").post(isAdmin, removeOfferFromPackages);
router.route("/admin/offer/packages").get(isAdmin, getPakagesAccordingToOffer);
// ============================== END OF OFFER ROUTES ============================

// ============================== TESTIMONIAL ROUTES =============================
router
  .route("/admin/testimonial")
  .post(isAdmin, upload.array("image", 1), createTestimonial);
router.route("/admin/testimonial").get(isAdmin, getTestimonials);
router.route("/admin/testimonial/:id").delete(isAdmin, deleteTestimonial);
router
  .route("/admin/testimonial/:id")
  .put(isAdmin, upload.array("image", 1), updateTestimonial);
router
  .route("/admin/testimonial/featured/:id")
  .put(isAdmin, featuredTestimonial);
// ============================== END OF TESTIMONIAL ROUTES ======================

// ============================== ENQUIRY ROUTES ================================
router.route("/admin/enquiry").get(isAdmin, getEnquiries);
router.route("/admin/enquiry/:id").delete(isAdmin, deleteEnquiry);
export default router;
