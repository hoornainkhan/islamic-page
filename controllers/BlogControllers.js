const blogModel = require("../models/BlogModel");

const getAdminBlog = async (req, res, next) => {
  try {
    const Blogs = await blogModel.find({});
    res.render("Admin/Blogs.ejs", { Blogs });
  } catch (error) {
    return next(res.send(error));
  }
};

const acquireBlog = async (req, res, next) => {
  try {
    const Blogs = await blogModel.find({});
    res.render("user/AllBlogs.ejs", { Blogs });
  } catch (err) {
    return next(res.render("error/error404"));
  }
};

const userBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);

    if (!blog) {
      return next(res.render("error/error404"));
    }
    console.log(blog);
    res.render("user/userBlogId.ejs", { blog });
  } catch (error) {
    return next(res.render("error/error404"));
  }
};

const editBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const EditBlog = await blogModel.findById(id);
    return res.render("Admin/editBlog.ejs", { EditBlog });
  } catch (error) {
    return next(res.send(error));
  }
};

const addBlog = (req, res, next) => {
  try {
    res.render("Admin/newBlog.ejs");
  } catch (error) {
    return next(res.send(error));
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, subheadings, descriptions } = req.body;
    const updatedBlog = { title, description };

    const sections = subheadings.map((subheading, index) => ({
      subheading,
      description: descriptions[index],
    }));

    updatedBlog.sections = sections;

    // Handle image update
    if (req.files["images"] && req.files["images"][0]) {
      const imageFile = req.files["images"][0];
      updatedBlog.image = imageFile.buffer.toString("base64");
    }

    const updatedBlogDoc = await blogModel.findByIdAndUpdate(id, updatedBlog, {
      runValidators: true,
      new: true,
    });

    if (!updatedBlogDoc) {
      return next(res.render("error/error404"));
    }

    res.redirect("/getAdminBlog");
  } catch (error) {
    return next(res.send(error));
  }
};

const createBlog = async (req, res, next) => {
  try {
    const { title, description, subheadings, descriptions } = req.body;
    const imageBuffer = req.files["images"][0].buffer;
    const imageString = imageBuffer.toString("base64");

    const sections = subheadings.map((subheading, index) => ({
      subheading,
      description: descriptions[index],
    }));

    const newBlog = new blogModel({
      title,
      description,
      sections,
      image: imageString,
    });

    await newBlog.save();

    if (!newBlog) {
      return next(res.render("error/error404"));
    }

    res.redirect("/getAdminBlog");
  } catch (error) {
    return next(res.send(error));
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Deleting blog with id:", id);
    const deleteBlog = await blogModel.findByIdAndDelete(id);
    console.log("Deleted blog:", deleteBlog);

    if (!deleteBlog) {
      return next(res.render("error/error404"));
    }
    return res.redirect("/getAdminBlog");
  } catch (error) {
    return next(res.send(error));
  }
};

module.exports = {
  getAdminBlog,
  acquireBlog,
  updateBlog,
  userBlogById,
  editBlog,
  addBlog,
  createBlog,
  deleteBlog,
};
