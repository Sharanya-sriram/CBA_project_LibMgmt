const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String },
  publicationDate: { type: Number },
  description: { type: String },
});

module.exports = mongoose.model("Book", bookSchema);
