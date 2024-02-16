const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const posts = mongoose.model("posts", postSchema);
module.exports = posts;
