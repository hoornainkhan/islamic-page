const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const isLoggedIn = require("../middleware/authenticateToken");

const {
  getAdminResource,
  acquireResource,
  updateResource,
  editAdminResource,
  userResourceById,
  addResource,
  createResource,
  downloadB64,
  downloadGFS,
  deleteResource,
} = require("../controllers/ResourceControllers");

const {
  DownloadB64,
  DownloadGFS,
} = require("../controllers/PublicationControllers");

router.get("/getAdminResource", isLoggedIn, getAdminResource);

router.get("/getUserResources", acquireResource);

router.get("/editAdminResource/:id", isLoggedIn, editAdminResource);

router.get("/getUserResource/:id", userResourceById);

router.put(
  "/getResource/:id",
  isLoggedIn,
  upload.fields([
    { name: "images", maxCount: 1 },
    { name: "pdfs", maxCount: 1 },
  ]),
  updateResource
);

router.get("/addResource", isLoggedIn, addResource);

router.post(
  "/createResource",
  isLoggedIn,
  upload.fields([
    { name: "images", maxCount: 1 },
    { name: "pdfs", maxCount: 1 },
  ]),
  createResource
);

router.get("/downloadB64/:id", downloadB64);

router.get("/downloadGFS/:id", downloadGFS);

router.delete("/deleteResource/:id", isLoggedIn, deleteResource);

module.exports = router;
