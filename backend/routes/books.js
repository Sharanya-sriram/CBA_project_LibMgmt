const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

//  Get all books
router.get("/", booksController.getBooks);

//  Add a book
router.post("/", booksController.addBook);

//  Update a book
router.put("/:id", booksController.updateBook);

//  Delete a book
router.delete("/:id", booksController.deleteBook);

module.exports = router;
