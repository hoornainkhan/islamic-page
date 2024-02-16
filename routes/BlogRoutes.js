const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const isLoggedIn = require("../middleware/authenticateToken");

const {
  getAdminBlog,
  updateBlog,
  editBlog,
  userBlogById,
  addBlog,
  acquireBlog,
  createBlog,
  deleteBlog,
} = require("../controllers/BlogControllers");

router.get("/getAdminBlog", isLoggedIn, getAdminBlog);

router.get("/getUserBlogs", acquireBlog);

router.get("/editAdminBlog/:id", isLoggedIn, editBlog);

router.get("/getUserBlog/:id", userBlogById);

router.put(
  "/getBlog/:id",
  isLoggedIn,
  upload.fields([
    { name: "images", maxCount: 1 },
    { name: "pdfs", maxCount: 1 },
  ]),
  updateBlog
);

router.get("/addBlog", isLoggedIn, addBlog);

router.post(
  "/getBlog",
  isLoggedIn,
  upload.fields([
    { name: "images", maxCount: 1 },
    { name: "pdfs", maxCount: 1 },
  ]),
  createBlog
);

router.delete("/deleteBlog/:id", isLoggedIn, deleteBlog);

module.exports = router;
