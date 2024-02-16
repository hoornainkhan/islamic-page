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
