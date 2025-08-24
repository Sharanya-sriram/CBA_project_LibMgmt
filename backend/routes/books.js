const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

// Get all books
router.get("/", booksController.getAllBooks);

// Get book by id
router.get("/:id", booksController.getBookById);

// Add a new book
router.post("/", booksController.createBook);

// Update a book by id
router.put("/:id", booksController.updateBook);

// Delete a book by id
router.delete("/:id", booksController.deleteBook);

module.exports = router;
