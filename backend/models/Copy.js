const mongoose = require("mongoose");

const copySchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book", // Reference to the Book model
    required: true,
  },
  copyId: {
    type: String,
    required: true,
    unique: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Copy", copySchema);
 
