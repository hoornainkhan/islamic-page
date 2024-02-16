const CourseModel = require("../models/courseModel");

const getAdminCourse = async (req, res, next) => {
  try {
    const Courses = await CourseModel.find({});
    res.render("Admin/Courses.ejs", { Courses });
  } catch (err) {
    return next(res.send(err)); // Just pass the error object to the next middleware
  }
};

const addCourse = (req, res, next) => {
  try {
    res.render("Admin/newCourse.ejs");
  } catch (error) {
    console.error(error);
    return next(res.render("error/error404"));
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { title, link, category, description } = req.body;
    const imageFile = req.file; // Assuming you have configured file upload middleware

    // Validate required fields
    if (!title || !link || !category || !description) {
      return res.status(400).send("All fields are required");
    }

    const imageBuffer = req.files[0].buffer; // Assuming single file upload
    const imageString = imageBuffer.toString("base64");

    // Create a new course
    const newCourse = new CourseModel({
      title,
      link,
      category,
      image: imageString, // Store image in base64 format
      description,
    });

    await newCourse.save();

    res.redirect("/getAdminCourse");
  } catch (error) {
    return next(res.send(error));
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, link, category, description } = req.body;

    if (!title || !description || !link || !category) {
      return res
        .status(400)
        .json({ error: "Validation error, required fields." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }

    const imageBuffer = req.files[0].buffer; // Assuming single file upload
    const imageString = imageBuffer.toString("base64");

    const existingCourse = await CourseModel.findById(id);

    if (!existingCourse) {
      return res.status(404).json({ error: "Course not found." });
    }

    // Handle image update if a new file is uploaded

    // Update the existing course with the new data
    existingCourse.title = title;
    existingCourse.description = description;
    existingCourse.image = imageString;
    existingCourse.category = category;
    existingCourse.link = link;

    // Save the updated course
    await existingCourse.save();

    // Redirect or respond as needed
    res.redirect("/getAdminCourse");
  } catch (error) {
    return next(res.send(error));
  }
};

const editAdminCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const EditCourse = await CourseModel.findById(id);
    return res.render("Admin/editCourse.ejs", { EditCourse });
  } catch (error) {
    return next(res.send(error));
  }
};

const userCourseById = async (req, res, next) => {
  try {
    const CourseId = req.params.id;
    // Your logic to fetch the post by ID
    const Courses = await CourseModel.findById(CourseId);

    if (!Courses) {
      // If post not found, respond with a 404 status and a message
      return next(res.render("error/error404"));
    }

    // Render or send the post data
    res.render("user/CourseId.ejs", { Courses });
  } catch (error) {
    // Handle other errors
    console.error(error);
    return next(res.render("error/error404"));
  }
};

const acquireCourse = async (req, res, next) => {
  try {
    const Courses = await CourseModel.find({});
    res.render("user/AllCourses.ejs", { Courses });
  } catch (error) {
    console.error(error);
    return next(res.render("error/error404"));
  }
};

const acquireKidCourse = async (req, res, next) => {
  try {
    const KidCourses = await CourseModel.find({});
    res.render("user/AllKidCourses.ejs", { KidCourses });
  } catch (error) {
    console.error(error);
    return next(res.render("error/error404"));
  }
};

const acquireWomenCourse = async (req, res, next) => {
  try {
    const WomenCourses = await CourseModel.find({});
    res.render("user/AllWomenCourses.ejs", { WomenCourses });
  } catch (error) {
    console.error(error);
    return next(res.render("error/error404"));
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Deleting Infographic with id:", id);
    const deleteCourse = await CourseModel.findByIdAndDelete(id);
    console.log("Deleted Course:", deleteCourse);

    if (!deleteCourse) {
      return next(res.render("error/error404"));
    }
    return res.redirect("/getAdminCourse");
  } catch (error) {
    return next(res.send(error));
  }
};

const acquireHomeCourse = async (req, res, next) => {
  try {
    const Courses = await CourseModel.find({});
    res.redirect("user/home.ejs", { Courses });
  } catch (error) {
    console.error(error);
    return next(res.render("error/error404"));
  }
};

module.exports = {
  getAdminCourse,
  updateCourse,
  editAdminCourse,
  userCourseById,
  acquireHomeCourse,
  addCourse,
  acquireCourse,
  acquireKidCourse,
  acquireWomenCourse,
  createCourse,
  deleteCourse,
};
