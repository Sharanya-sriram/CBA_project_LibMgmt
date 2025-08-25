const pool = require("../config/db");

// Get all issued books
exports.getAllIssuedBooks = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM issuedBooks");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get issued books" });
  }
};

// Get issued book by ID
exports.getIssuedBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM issuedBooks WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Issued book not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get issued book" });
  }
};

// Create a new issued book entry (issue a copy)
exports.createIssuedBook = async (req, res) => {
  const { userId, bookId, copyId, issueDate, returnDate = null } = req.body;

  if (!userId || !bookId || !copyId || !issueDate) {
    return res.status(400).json({ message: "userId, bookId, copyId, and issueDate are required" });
  }

  try {
    // Insert issued book record
    const [result] = await pool.query(
      `INSERT INTO issuedBooks (userId, bookId, copyId, issueDate, returnDate) VALUES (?, ?, ?, ?, ?)`,
      [userId, bookId, copyId, issueDate, returnDate]
    );

    // Also update copy availability to 0 (unavailable)
    await pool.query(`UPDATE copies SET available = 0 WHERE copyId = ?`, [copyId]);

    res.status(201).json({ id: result.insertId, message: "Book copy issued successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to issue book copy" });
  }
};

// Update issued book (e.g. to add returnDate)
exports.updateIssuedBook = async (req, res) => {
  const { id } = req.params;
  const { userId, bookId, copyId, issueDate, returnDate } = req.body;

  try {
    // Update issuedBooks table
    const modIssueDate = issueDate ? new Date(issueDate).toISOString().slice(0, 10) : null;
    console.log(modIssueDate);
    const [result] = await pool.query(
      `UPDATE issuedBooks SET userId = ?, bookId = ?, copyId = ?, issueDate = ?, returnDate = ? WHERE id = ?`,
      [userId, bookId, copyId, modIssueDate, returnDate, id]
    );


    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Issued book not found" });
    }

    // If returnDate is set, mark copy available again
    if (returnDate) {
      await pool.query(`UPDATE copies SET available = 1 WHERE copyId = ?`, [copyId]);
    }

    res.json({ message: "Issued book updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update issued book" });
  }
};

// Delete an issued book entry (return book)
exports.deleteIssuedBook = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the issued book entry to get copyId
    const [rows] = await pool.query(`SELECT copyId FROM issuedBooks WHERE id = ?`, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Issued book not found" });
    }

    const { copyId } = rows[0];

    // Delete the issued book record
    const [result] = await pool.query(`DELETE FROM issuedBooks WHERE id = ?`, [id]);

    // Mark the copy available again
    await pool.query(`UPDATE copies SET available = 1 WHERE copyId = ?`, [copyId]);

    res.json({ message: "Issued book deleted (book returned)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete issued book" });
  }
};
