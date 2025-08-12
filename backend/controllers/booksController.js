const pool = require("../config/db");

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const [rows] = await pool.query(`
    SELECT b.*, 
           COUNT(c.id) AS totalCopies,
           SUM(CASE WHEN c.available = 1 THEN 1 ELSE 0 END) AS availableCopies
    FROM books b
    LEFT JOIN copies c ON b.id = c.bookId
    GROUP BY b.id
  `);
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
  const formattedDate = publicationDate 
  ? new Date(publicationDate).toISOString().split("T")[0] 
  : null;

  try {
    const [result] = await pool.query(
      "UPDATE books SET title = ?, author = ?, genre = ?, publicationDate = ?, description = ? WHERE id = ?",
      [title, author, genre, formattedDate, description, id]
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

exports.updateBookCopies = async (req, res) => {
  const { id } = req.params; // book id
  const { copies } = req.body; // array of copies [{copyId, available}, ...]

  if (!copies || !Array.isArray(copies)) {
    return res.status(400).json({ message: "Copies array is required" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Delete all copies for this book first
    await conn.query("DELETE FROM copies WHERE bookId = ?", [id]);

    // Insert all new copies for this book
    const insertPromises = copies.map((copy) =>
      conn.query(
        "INSERT INTO copies (bookId, copyId, available) VALUES (?, ?, ?)",
        [id, copy.copyId, copy.available ? 1 : 0]
      )
    );

    await Promise.all(insertPromises);

    await conn.commit();
    res.json({ message: "Copies updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: "Failed to update copies" });
  } finally {
    conn.release();
  }
};