import express from "express";
import {
  adminSignin,
  adminSignup,
  getAllActiveCars,
  getAllActiveBlogs,
  getAllActivePackages,
  getAllHotDeals,
  getAllDestinationPublic,
  getPackagesByDestination,
} from "../controllers/indexController.js";
import { getFeaturedTestimonials } from "../controllers/testimonialsController.js";
import {
  getFeaturedPackages,
  getRajasthaniPackages,
  FilterPackages,
} from "../controllers/packageController.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from index router");
});

router.post("/adminSignup", adminSignup);
router.post("/adminSignin", adminSignin);

// get active cars
router.get("/activeCars", getAllActiveCars);

// get all active blogs
router.get("/activeBlogs", getAllActiveBlogs);

// get all active packages
router.get("/activePackages", getAllActivePackages);

// get all hotdeals
router.get("/hotdeals", getAllHotDeals);

// get all destinations
router.get("/public/destinations", getAllDestinationPublic);

// get packages by destination
router.get("/public/packages/:destination", getPackagesByDestination);

// get featured testimonials
router.get("/public/testimonials", getFeaturedTestimonials);

// get featured packages
router.get("/public/featuredPackages", getFeaturedPackages);

// get rajasthani packages
router.get("/public/rajasthaniPackages", getRajasthaniPackages);

// filter packages
router.post("/public/filterPackages", FilterPackages);

export default router;
