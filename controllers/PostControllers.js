const postModel = require("../models/postModel");

const getAdminPost = async (req, res, next) => {
  try {
    const posts = await postModel.find({});
    res.render("Admin/Posts.ejs", { posts });
  } catch (error) {
    return next(res.send(error)); // Just pass the error object to the next middleware
  }
};

const addPost = (req, res, next) => {
  try {
    res.render("Admin/newPost.ejs");
  } catch (error) {
    console.log(error);
    return next(res.send(error));
  }
};

const createPost = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }
    const { title, description } = req.body;
    const imageBuffer = req.files[0].buffer; // Assuming single file upload
    const imageString = imageBuffer.toString("base64");
    const newPost = new postModel({
      image: imageString,
      title,
      description,
      // Add other fields from your form or adjust as needed
    });

    await newPost.save();

    if (!newPost) {
      return next(new Error("Details are incomplete."));
    }

    res.redirect("/getAdminPost");
  } catch (error) {
    return next(res.send(error));
  }
};

const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.id;

    // Assuming you want to update only the image
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }

    const updatedImageBuffer = req.files[0].buffer; // Assuming single file upload
    const updatedImageString = updatedImageBuffer.toString("base64");

    // Find the post by ID
    const postToUpdate = await postModel.findById(postId);

    if (!postToUpdate) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Update the image field
    postToUpdate.image = updatedImageString;

    // Save the updated post
    await postToUpdate.save();

    res.redirect("/getAdminPost");
  } catch (error) {
    return next(res.send(error));
  }
};

const editPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const EditPost = await postModel.findById(id);
    return res.render("Admin/editPost.ejs", { EditPost });
  } catch (error) {
    return next(res.send(error));
  }
};

const userPostById = async (req, res, next) => {
  try {
    const postId = req.params.id;
    // Your logic to fetch the post by ID
    const posts = await postModel.findById(postId);

    if (!posts) {
      // If post not found, respond with a 404 status and a message
      return next(res.render("error/error404"));
    }

    // Render or send the post data
    console.log(posts);
    res.render("user/PostId.ejs", { posts });
  } catch (error) {
    // Handle other errors
    console.error(error);
    return next(res.render("error/error404"));
  }
};

const acquirePost = async (req, res, next) => {
  try {
    const posts = await postModel.find({});
    res.render("user/AllPosts.ejs", { posts });
  } catch (error) {
    console.log(error);
    return next(res.render("error/error404"));
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Deleting Post with id:", id);
    const deletePost = await postModel.findByIdAndDelete(id);
    console.log("Deleted Post:", deletePost);

    if (!deletePost) {
      return res.status(404).send("Post not found");
    }
    return res.redirect("/getAdminPost");
  } catch (error) {
    return next(res.send(error));
  }
};

module.exports = {
  getAdminPost,
  updatePost,
  editPost,
  userPostById,
  addPost,
  acquirePost,
  createPost,
  deletePost,
};
