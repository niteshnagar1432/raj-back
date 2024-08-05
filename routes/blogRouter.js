import express from "express";
import isAdmin from "../middlewares/isLogin.js";
import {isUser} from "../middlewares/isLogin.js";
import { upload } from "../middlewares/bucket.js";
import {
  addBlog,
  deleteBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  addCommentBlog
} from "../controllers/blogController.js";
const router = express.Router();

router
  .route("/blog")
  .post(
    isAdmin,
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "otherImages", maxCount: 5 },
      { name: "backgroundImage", maxCount: 1 },
    ]),
    addBlog
  )
  .get(getAllBlogs);

// by id
router
  .route("/blog/:id")
  .get(getBlog)
  .delete(isAdmin, deleteBlog)
  .put(
    isAdmin,
    upload.fields([
      { name: "coverImage", maxCount: 1 },
      { name: "otherImages", maxCount: 5 },
      { name: "backgroundImage", maxCount: 1 },
    ]),
    updateBlog
  );
 
// comment in blog 
router
  .route("/blog-comment/:id")
  .post(isUser, addCommentBlog);

export default router;
