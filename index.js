import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnection from "./database/db.js";

// ====================================================================

const app = express();
dotenv.config();
const PORT = process.env.PORT;

// ============================== MIDDLEWARES ==========================

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

// CORS Configuration
app.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
});

// ================================= ROUTES ==============================

import indexRoutes from "./routes/indexRouter.js";
import adminRoutes from "./routes/adminRouter.js";
import userRoutes from "./routes/userRouter.js";
import PaymentTerm from "./routes/paymentTermRouter.js";
import TermsAndCondition from "./routes/termsAndConditionRouter.js";
import TravelEssentials from "./routes/travelEssentialsRouter.js";
import BlogRoutes from "./routes/blogRouter.js";
import FAQRoutes from "./routes/faqRouter.js";
import ReviewRoutes from "./routes/reviewRouter.js";
import TripTypeRoutes from "./routes/tripTypeRouter.js";
import DestinationRoutes from "./routes/destinationRouter.js";
import CouponRoutes from "./routes/couponRoutes.js";
import BannerRouter from "./routes/bannerRouter.js";
import ContactUsRouter from "./routes/contactUsRouter.js";
import CallBackRouter from "./routes/callBackRouter.js";

app.use("/api", indexRoutes);
app.use("/api", adminRoutes);
app.use("/api", userRoutes);
app.use("/api", PaymentTerm);
app.use("/api", TermsAndCondition);
app.use("/api", TravelEssentials);
app.use("/api", BlogRoutes);
app.use("/api", FAQRoutes);
app.use("/api", ReviewRoutes);
app.use("/api", TripTypeRoutes);
app.use("/api", DestinationRoutes);
app.use("/api", CouponRoutes);
app.use("/api", BannerRouter);
app.use("/api", ContactUsRouter);
app.use("/api", CallBackRouter);
// ========================================================================

const MONGODB_URL = process.env.MONGODB_URL;
dbConnection(MONGODB_URL);

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Error while listening on PORT: ${PORT}`);
  } else {
    console.log(`Server is listening on PORT: ${PORT}`);
  }
});
