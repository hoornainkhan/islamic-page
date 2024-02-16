const InfographicModel = require("../models/InfographicModel");

const getAdminInfographic = async (req, res, next) => {
  try {
    const Infographics = await InfographicModel.find({});
    res.render("Admin/Infographics.ejs", { Infographics });
  } catch (error) {
    return next(res.send(error)); // Just pass the error object to the next middleware
  }
};

const addInfographic = (req, res, next) => {
  try {
    res.render("Admin/newInfographic.ejs");
  } catch (error) {
    return next(res.send(error));
  }
};

const createInfographic = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }
    const { title, description } = req.body;
    const imageBuffer = req.files[0].buffer; // Assuming single file upload
    const imageString = imageBuffer.toString("base64");
    const newInfographic = new InfographicModel({
      image: imageString,
      title,
      description,
      // Add other fields from your form or adjust as needed
    });

    await newInfographic.save();

    if (!newInfographic) {
      return next(new Error("Details are incomplete."));
    }

    res.redirect("/getAdminInfographic");
  } catch (error) {
    return next(res.send(error));
  }
};

// const updateInfographic = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const { title, description } = req.body;

//     // Check if the required fields are present
//     if (!title || !description) {
//       return res
//         .status(400)
//         .json({ error: "Title and description are required fields." });
//     }

//     // Find the existing infographic by ID
//     const existingInfographic = await InfographicModel.findById(id);

//     // If the infographic is not found, return a 404 status
//     if (!existingInfographic) {
//       return res.status(404).json({ error: "Infographic not found." });
//     }

//     // Handle image update if a new file is uploaded
//     if (req.files && req.files.length > 0) {
//       const imageBuffer = req.files[0].buffer; // Assuming single file upload
//       const imageString = imageBuffer.toString("base64");
//       existingInfographic.image = imageString;
//     }

//     // Update the existing infographic with the new data
//     existingInfographic.title = title;
//     existingInfographic.description = description;

//     // Save the updated infographic
//     await existingInfographic.save();

//     // Redirect or respond as needed
//     res.redirect("/getAdminInfographic");
//   } catch (error) {
//     return next(res.send(error));
//   }
// };

const updateInfographic = async (req, res, next) => {
  try {
    const infographicId = req.params.id;
    const { title, description } = req.body;
    // Assuming you want to update only the image
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files were uploaded." });
    }

    const updatedImageBuffer = req.files[0].buffer; // Assuming single file upload
    const updatedImageString = updatedImageBuffer.toString("base64");

    // Find the post by ID
    const infographicToUpdate = await InfographicModel.findById(infographicId);

    if (!infographicToUpdate) {
      return res.status(404).json({ error: "Infographic not found." });
    }

    // Update the image field
    infographicToUpdate.image = updatedImageString;
    infographicToUpdate.title = title;
    infographicToUpdate.description = description;

    // Save the updated post
    await infographicToUpdate.save();

    res.redirect("/getAdminInfographic");
  } catch (error) {
    return next(res.send(error));
  }
};

const editInfographic = async (req, res, next) => {
  try {
    const { id } = req.params;
    const EditInfographic = await InfographicModel.findById(id);
    return res.render("Admin/editInfographic.ejs", { EditInfographic });
  } catch (error) {
    return next(res.send(error));
  }
};

const userInfographicById = async (req, res, next) => {
  try {
    const InfographicId = req.params.id;
    // Your logic to fetch the post by ID
    const Infographics = await InfographicModel.findById(InfographicId);

    if (!Infographics) {
      // If post not found, respond with a 404 status and a message
      return next(res.render("error/error404"));
    }

    // Render or send the post data
    res.render("user/InfographicId.ejs", { Infographics });
  } catch (error) {
    return next(res.render("error/error404"));
  }
};

const acquireInfographic = async (req, res, next) => {
  try {
    const Infographics = await InfographicModel.find({});
    res.render("user/AllInfographics.ejs", { Infographics });
  } catch (err) {
    return next(res.render("error/error404"));
  }
};

const deleteInfographic = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Deleting Infographic with id:", id);
    const deleteInfographic = await InfographicModel.findByIdAndDelete(id);
    console.log("Deleted Infographic:", deleteInfographic);

    if (!deleteInfographic) {
      return res.status(404).send("Post not found");
    }
    return res.redirect("/getAdminInfographic");
  } catch (error) {
    return next(res.send(error));
  }
};

module.exports = {
  getAdminInfographic,
  updateInfographic,
  editInfographic,
  userInfographicById,
  addInfographic,
  acquireInfographic,
  createInfographic,
  deleteInfographic,
};
