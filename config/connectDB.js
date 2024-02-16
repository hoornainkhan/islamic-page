const mongoose = require('mongoose');
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_STRING).then(() => {
      console.log("Database configured.");
    });
  };
  
module.exports = connectDB;

// let imageString, pdfString;
//     const MAX_FILE_SIZE_FOR_BASE64 = 1024 * 1024;

//     if (req.files['images'][0].size > MAX_FILE_SIZE_FOR_BASE64) {
//       const imageBuffer = req.files['images'][0].buffer;
//       imageString = imageBuffer.toString('base64');
//     } else {
//       imageString = req.files['images'][0].buffer.toString('base64');
//     }
//     pdfString = req.files['pdfs'][0].buffer.toString('base64');