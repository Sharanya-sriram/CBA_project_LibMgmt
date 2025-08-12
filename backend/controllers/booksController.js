const pool = require("../config/db");

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM books");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get books" });
  }
};

// Get book by id
exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const [[book]] = await pool.query("SELECT * FROM books WHERE id = ?", [id]);

    if (!book) return res.status(404).json({ message: "Book not found" });

    // Fetch copies for this book
    const [copies] = await pool.query("SELECT * FROM copies WHERE bookId = ?", [id]);

    book.copies = copies;

    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get book" });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
  const { title, author, genre, publicationDate, description } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO books (title, author, genre, publicationDate, description) VALUES (?, ?, ?, ?, ?)",
      [title, author, genre, publicationDate, description]
    );
    res.status(201).json({ id: result.insertId, message: "Book created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create book" });
  }
};

// Update a book
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, publicationDate, description } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE books SET title = ?, author = ?, genre = ?, publicationDate = ?, description = ? WHERE id = ?",
      [title, author, genre, publicationDate, description, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update book" });
  }
};

// Delete a book
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM books WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete book" });
  }
};
