const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const infographicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const infographics = mongoose.model("infographics", infographicSchema);
module.exports = infographics;
