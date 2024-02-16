const PublicationModel = require("../models/publicationModel");
const initGFS = require("../config/gridFS");
const { ObjectId } = require("mongodb");
const { Types } = require("mongoose");

const getAdminPublication = async (req, res, next) => {
  try {
    const Publications = await PublicationModel.find({});
    res.render("Admin/Publications.ejs", { Publications });
  } catch (error) {
    return next(res.send(error));
  }
};

const acquirePublication = async (req, res, next) => {
  try {
    const Publications = await PublicationModel.find({});
    res.render("user/AllPublications.ejs", { Publications });
  } catch (err) {
    return next(res.render("error/error404"));
  }
};

const acquireAcademyPublication = async (req, res, next) => {
  try {
    const AcademyPublications = await PublicationModel.find({});
    res.render("user/AllAcademyPublications.ejs", { AcademyPublications });
  } catch (err) {
    return next(res.render("error/error404"));
  }
};

const acquireEBookPublication = async (req, res, next) => {
  try {
    const EBookPublications = await PublicationModel.find({});
    res.render("user/AllEBookPublications.ejs", { EBookPublications });
  } catch (err) {
    return next(res.render("error/error404"));
  }
};

const acquireResourcePublication = async (req, res, next) => {
  try {
    const ResourcePublications = await PublicationModel.find({});
    res.render("user/AllResourcePublications.ejs", { ResourcePublications });
  } catch (err) {
    return next(res.render("error/error404"));
  }
};

const userPublicationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const Publications = await PublicationModel.findById(id);

    if (!Publications) {
      return next(res.render("error/error404"));
    }
    res.render("user/userPublicationId.ejs", { Publications });
  } catch (error) {
    return next(res.render("error/error404"));
  }
};

const editAdminPublication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const EditPublication = await PublicationModel.findById(id);
    return res.render("Admin/editPublication.ejs", { EditPublication });
  } catch (error) {
    return next(res.send(error));
  }
};

const addPublication = (req, res, next) => {
  try {
    res.render("Admin/newPublication.ejs");
  } catch (error) {
    return next(res.send(error));
  }
};

const updatePublication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, description } = req.body;
    const updatedPublication = { title, category, description };

    // Handle image update
    if (req.files["images"] && req.files["images"][0]) {
      const imageFile = req.files["images"][0];

      // For smaller images, store in base64 format
      updatedPublication.image = imageFile.buffer.toString("base64");
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
        updatedPublication.pdf = pdfWriteStream.id;
      } else {
        // For smaller PDF files, store in base64 format
        updatedPublication.pdf = pdfFile.buffer.toString("base64");
      }
    }

    const updatedPublicationDoc = await PublicationModel.findByIdAndUpdate(
      id,
      updatedPublication,
      { runValidators: true, new: true }
    );

    if (!updatedPublicationDoc) {
      return res.status(404).send("Publication not found");
    }

    res.redirect("/getAdminPublication");
  } catch (error) {
    return next(res.send(error));
  }
};

const createPublication = async (req, res, next) => {
  try {
    const { title, category, description } = req.body;
    const imageBuffer = req.files["images"][0].buffer;
    const imageString = imageBuffer.toString("base64");
    const pdfBuffer = req.files["pdfs"][0].buffer;

    const gfs = await initGFS(); // Initialize GridFS for PDF upload

    if (pdfBuffer.length <= 8 * 1024 * 1024) {
      // If PDF size is less than or equal to 12 MB, store as base64
      const pdfString = pdfBuffer.toString("base64");

      const newPublication = new PublicationModel({
        title,
        description,
        category,
        image: imageString,
        pdf: pdfString,
      });

      await newPublication.save();

      if (!newPublication) {
        return next(new Error("Details are incomplete or could not save."));
      }

      res.redirect("/getAdminPublication");
    } else {
      // If PDF size is greater than 8 MB, store in GridFS
      const pdfWriteStream = gfs.openUploadStream("newPublication.pdf", {
        contentType: "application/pdf",
      });

      pdfWriteStream.on("error", (error) => {
        console.error(error);
        res.status(500).json({ error: "Error during PDF upload" });
      });

      pdfWriteStream.on("finish", async () => {
        const newPublication = new PublicationModel({
          title,
          description,
          category,
          image: imageString,
          pdf: pdfWriteStream.id, // Use the GridFS file ID
        });

        await newPublication.save();

        if (!newPublication) {
          return next(new Error("Details are incomplete or could not save."));
        }

        res.redirect("/getAdminPublication");
      });

      pdfWriteStream.end(pdfBuffer);
    }
  } catch (error) {
    return next(res.send(error));
  }
};

const DownloadB64 = async (req, res, next) => {
  try {
    const Publications = await PublicationModel.findById(req.params.id);
    const { ObjectId } = require("mongoose").Types;

    if (!Publications || !Publications.pdf) {
      return res.status(404).send("Publication or PDF not found");
    }
    // If pdf is stored as base64 in the 'Publications' collection or size is <= 12 MB
    const pdfBuffer = Buffer.from(Publications.pdf, "base64");
    const filename = Publications.title + ".pdf";
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

const DownloadGFS = async (req, res, next) => {
  try {
    const Publications = await PublicationModel.findById(req.params.id);
    const { ObjectId } = require("mongoose").Types;
    console.log(Publications.pdf.length);

    if (!Publications || !Publications.pdf) {
      return res.status(404).send("Publication or PDF not found");
    }
    // If pdf is stored in GridFS
    const gfs = await initGFS();
    const pdfWriteStream = gfs.openDownloadStream(
      new ObjectId(Publications.pdf)
    );
    // console.log(pdfWriteStream)
    res.setHeader("Content-Type", "application/pdf");
    const filename = `Darulhikmah_${Publications.title}.pdf`;
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

const deletePublication = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting Publication with id:", id);
    const deletePublication = await PublicationModel.findByIdAndDelete(id);
    console.log("Deleted Publication:", deletePublication);

    if (!deletePublication) {
      return res.status(404).send("Publication not found");
    }
    return res.redirect("/getAdminPublication");
  } catch (error) {
    console.error(error);
    return next(res.send(error));
  }
};

module.exports = {
  getAdminPublication,
  acquirePublication,
  acquireAcademyPublication,
  acquireEBookPublication,
  acquireResourcePublication,
  updatePublication,
  userPublicationById,
  editAdminPublication,
  addPublication,
  createPublication,
  DownloadB64,
  DownloadGFS,
  deletePublication,
};
