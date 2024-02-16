const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const isLoggedIn = require("../middleware/authenticateToken");

const {
  getAdminPost,
  updatePost,
  editPost,
  userPostById,
  addPost,
  acquirePost,
  createPost,
  deletePost,
} = require("../controllers/PostControllers");

router.get("/getAdminPost", isLoggedIn, getAdminPost);

router.get("/getUserPosts", acquirePost);

router.get("/editAdminPost/:id", isLoggedIn, editPost);

router.get("/getUserPost/:id", userPostById);

router.put("/getPost/:id", isLoggedIn, upload.array("images", 1), updatePost);

router.get("/addPost", isLoggedIn, addPost);

router.post("/getPost", isLoggedIn, upload.array("images", 1), createPost);

router.delete("/deletePost/:id", isLoggedIn, deletePost);

module.exports = router;
