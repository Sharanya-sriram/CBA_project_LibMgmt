const Book = require("../models/Book");

// 📚 Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error });
  }
};

// ➕ Add a new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, publicationDate, description } = req.body;
    const newBook = new Book({ title, author, genre, publicationDate, description });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error });
  }
};

// ✏️ Update a book
exports.updateBook = async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
};

// ❌ Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
};
