// models/IssuedBook.js
const mongoose = require("mongoose");

const IssuedBookSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    bookId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Book", 
      required: true 
    },
    copyId: { 
      type: String, 
      required: true 
    },
    issueDate: { 
      type: Date, 
      default: Date.now 
    },
    returnDate: { 
      type: Date 
    }
  },
  { timestamps: true } // adds createdAt, updatedAt
);

module.exports = mongoose.model("IssuedBook", IssuedBookSchema);
