const ResourceModel = require("../models/resourceModel");
const initGFS = require("../config/gridFS");
const { ObjectId } = require("mongodb");
const { Types } = require("mongoose");

const getAdminResource = async (req, res, next) => {
  try {
    const Resources = await ResourceModel.find({});
    res.render("Admin/Resources.ejs", { Resources });
  } catch (error) {
    return next(res.send(error));
  }
};

const acquireResource = async (req, res, next) => {
  try {
    const Resources = await ResourceModel.find({});
    res.render("user/AllResources.ejs", { Resources });
  } catch (err) {
    return next(res.render("error/error404"));
  }
};

const userResourceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Resources = await ResourceModel.findById(id);

    if (!Resources) {
      return next(new Error("Resource not found"));
    }
    res.render("user/userResourceId.ejs", { Resources });
  } catch (error) {
    return next(res.render("error/error404"));
  }
};

const editAdminResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const EditResource = await ResourceModel.findById(id);
    return res.render("Admin/editResource.ejs", { EditResource });
  } catch (error) {
    return next(res.send(error));
  }
};

const addResource = (req, res, next) => {
  try {
    res.render("Admin/newResource.ejs");
  } catch (error) {
    return next(res.render("error/error404"));
  }
};

const updateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updatedResource = { title, description };

    // Handle image update
    if (req.files["images"] && req.files["images"][0]) {
      const imageFile = req.files["images"][0];

      // For smaller images, store in base64 format
      updatedResource.image = imageFile.buffer.toString("base64");
    }
    // Initialize GridFS
    const gfs = await initGFS();
    // Handle PDF update
    if (req.files["pdfs"] && req.files["pdfs"][0]) {
      const pdfFile = req.files["pdfs"][0];

      if (pdfFile.size > 12 * 1024 * 1024) {
        console.log("Big size");
        // If size is greater than 12 MB, upload to GridFS
        const pdfWriteStream = gfs.openUploadStream(pdfFile.originalname, {
          contentType: pdfFile.mimetype,
        });

        pdfWriteStream.end(pdfFile.buffer); // Use end to write the buffer
        updatedResource.pdf = pdfWriteStream.id;
      } else {
        // For smaller PDF files, store in base64 format
        updatedResource.pdf = pdfFile.buffer.toString("base64");
      }
    }

    const updatedResourceDoc = await ResourceModel.findByIdAndUpdate(
      id,
      updatedResource,
      { runValidators: true, new: true }
    );

    if (!updatedResourceDoc) {
      return res.status(404).send("Resource not found");
    }

    res.redirect("/getAdminResource");
  } catch (error) {
    return next(res.send(error));
  }
};

const createResource = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const imageBuffer = req.files["images"][0].buffer;
    const imageString = imageBuffer.toString("base64");
    const pdfBuffer = req.files["pdfs"][0].buffer;

    const gfs = await initGFS(); // Initialize GridFS for PDF upload

    if (pdfBuffer.length <= 8 * 1024 * 1024) {
      // If PDF size is less than or equal to 12 MB, store as base64
      const pdfString = pdfBuffer.toString("base64");

      const newResource = new ResourceModel({
        title,
        description,
        image: imageString,
        pdf: pdfString,
      });

      await newResource.save();

      if (!newResource) {
        return next(new Error("Details are incomplete or could not save."));
      }

      res.redirect("/getAdminResource");
    } else {
      // If PDF size is greater than 8 MB, store in GridFS
      const pdfWriteStream = gfs.openUploadStream("newResource.pdf", {
        contentType: "application/pdf",
      });

      pdfWriteStream.on("error", (error) => {
        console.error(error);
        res.status(500).json({ error: "Error during PDF upload" });
      });

      pdfWriteStream.on("finish", async () => {
        const newResource = new ResourceModel({
          title,
          description,
          image: imageString,
          pdf: pdfWriteStream.id, // Use the GridFS file ID
        });

        await newResource.save();

        if (!newResource) {
          return next(new Error("Details are incomplete or could not save."));
        }

        res.redirect("/getAdminResource");
      });

      pdfWriteStream.end(pdfBuffer);
    }
  } catch (error) {
    return next(res.send(error));
  }
};

const downloadB64 = async (req, res) => {
  try {
    const { id } = req.params;
    const Resources = await ResourceModel.findById(id);

    if (!Resources || !Resources.pdf) {
      return res.status(404).send("Resource or PDF not found");
    }

    // Fetch the base64 encoded PDF data from Resources
    const pdfBuffer = Buffer.from(Resources.pdf, "base64");

    // Set headers for file download
    const filename = Resources.title + ".pdf";
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${encodeURIComponent(filename)}`
    );
    res.send(pdfBuffer);
  } catch (error) {
    return next(res.send(error));
  }
};

const downloadGFS = async (req, res, next) => {
  try {
    const Resources = await ResourceModel.findById(req.params.id);
    const { ObjectId } = require("mongoose").Types;
    console.log(Resources.pdf.length);

    if (!Resources || !Resources.pdf) {
      return res.status(404).send("Publication or PDF not found");
    }
    // If pdf is stored in GridFS
    const gfs = await initGFS();
    const pdfWriteStream = gfs.openDownloadStream(new ObjectId(Resources.pdf));
    // console.log(pdfWriteStream)
    res.setHeader("Content-Type", "application/pdf");
    const filename = `Darulhikmah_${Resources.title}.pdf`;
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    pdfWriteStream.on("data", (chunk) => {
      res.write(chunk); // Send the chunk to the client
    });

    pdfWriteStream.on("end", () => {
      res.end(); // End the response when all chunks are sent
    });

    pdfWriteStream.on("error", (error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "Internal Server Error during PDF stream" });
    });

    console.log("GRIDFS");
  } catch (error) {
    return next(res.send(error));
  }
};

const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting Resource with id:", id);
    const deleteResource = await ResourceModel.findByIdAndDelete(id);
    console.log("Deleted Resource:", deleteResource);

    if (!deleteResource) {
      return res.status(404).send("Resource not found");
    }
    return res.redirect("/getAdminResource");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAdminResource,
  acquireResource,
  updateResource,
  userResourceById,
  editAdminResource,
  addResource,
  createResource,
  downloadB64,
  downloadGFS,
  deleteResource,
};
