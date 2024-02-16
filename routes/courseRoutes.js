const express = require("express");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const isLoggedIn = require("../middleware/authenticateToken");

const {
  getAdminCourse,
  updateCourse,
  editAdminCourse,
  userCourseById,
  acquireHomeCourse,
  addCourse,
  acquireWomenCourse,
  acquireKidCourse,
  acquireCourse,
  createCourse,
  deleteCourse,
} = require("../controllers/CourseControllers");

router.get("/getAdminCourse", isLoggedIn, getAdminCourse);

router.get("/getUserCourses", acquireCourse);

router.get("/home", acquireHomeCourse);

router.get("/getUserWomenCourses", acquireWomenCourse);

router.get("/getUserKidCourses", acquireKidCourse);

router.get("/editAdminCourse/:id", isLoggedIn, editAdminCourse);

router.get("/getUserCourse/:id", userCourseById);

router.put(
  "/getCourse/:id",
  isLoggedIn,
  upload.array("image", 1),
  updateCourse
);

router.get("/addCourse", isLoggedIn, addCourse);

router.post("/getCourse", isLoggedIn, upload.array("image", 1), createCourse);

router.delete("/deleteCourse/:id", isLoggedIn, deleteCourse);

module.exports = router;
