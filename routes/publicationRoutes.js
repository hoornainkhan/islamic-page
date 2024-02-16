const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const isLoggedIn = require("../middleware/authenticateToken");

const {
  getAdminPublication,
  acquirePublication,
  acquireResourcePublication,
  updatePublication,
  editAdminPublication,
  userPublicationById,
  acquireAcademyPublication,
  acquireEBookPublication,
  addPublication,
  createPublication,
  DownloadB64,
  DownloadGFS,
  deletePublication,
} = require("../controllers/PublicationControllers");

router.get("/getAdminPublication", isLoggedIn, getAdminPublication);

router.get("/getUserPublications", acquirePublication);

router.get("/getUserAcademyPublications", acquireAcademyPublication);

router.get("/getUserResourcePublications", acquireResourcePublication);

router.get("/getUserEBookPublications", acquireEBookPublication);

router.get("/editAdminPublication/:id", isLoggedIn, editAdminPublication);

router.get("/getUserPublication/:id", userPublicationById);

router.put(
  "/getPublication/:id",
  isLoggedIn,
  upload.fields([
    { name: "images", maxCount: 1 },
    { name: "pdfs", maxCount: 1 },
  ]),
  updatePublication
);

router.get("/addPublication", isLoggedIn, addPublication);

router.post(
  "/getPublication",
  isLoggedIn,
  upload.fields([
    { name: "images", maxCount: 1 },
    { name: "pdfs", maxCount: 1 },
  ]),
  createPublication
);

router.get("/downloadB64/:id", DownloadB64);

router.get("/downloadGFS/:id", DownloadGFS);

router.delete("/deletePublication/:id", isLoggedIn, deletePublication);

module.exports = router;
