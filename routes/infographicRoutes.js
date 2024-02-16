const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const isLoggedIn = require("../middleware/authenticateToken");

const {
  getAdminInfographic,
  updateInfographic,
  editInfographic,
  userInfographicById,
  addInfographic,
  acquireInfographic,
  createInfographic,
  deleteInfographic,
} = require("../controllers/InfographicControllers");

router.get("/getAdminInfographic", isLoggedIn, getAdminInfographic);

router.get("/getUserInfographics", acquireInfographic);

router.get("/editAdminInfographic/:id", isLoggedIn, editInfographic);

router.get("/getUserInfographic/:id", userInfographicById);

router.put(
  "/getInfographic/:id",
  isLoggedIn,
  upload.array("images", 1),
  updateInfographic
);

router.get("/addInfographic", isLoggedIn, addInfographic);

router.post(
  "/getInfographic",
  isLoggedIn,
  upload.array("images", 1),
  createInfographic
);

router.delete("/deleteInfographic/:id", isLoggedIn, deleteInfographic);

module.exports = router;
