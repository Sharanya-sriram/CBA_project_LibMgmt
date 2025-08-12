const pool = require("../config/db");

// Validation helper
const validateCopyData = ({ bookId, copyId }) => {
  if (!bookId || !copyId) {
    return false;
  }
  return true;
};

// Get all copies
exports.getAllCopies = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM copies");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get copies" });
  }
};

// Get copies by book ID
exports.getCopiesByBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM copies WHERE bookId = ?", [bookId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get copies for book" });
  }
};

// Create a new copy
exports.createCopy = async (req, res) => {
  const { bookId, copyId, available = 1 } = req.body;

  if (!validateCopyData({ bookId, copyId })) {
    return res.status(400).json({ message: "bookId and copyId are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO copies (bookId, copyId, available) VALUES (?, ?, ?)",
      [bookId, copyId, available ? 1 : 0]
    );
    res.status(201).json({ id: result.insertId, message: "Copy created" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "CopyId already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to create copy" });
  }
};

// Update a copy
exports.updateCopy = async (req, res) => {
  const { id } = req.params;
  const { bookId, copyId, available } = req.body;

  if (!validateCopyData({ bookId, copyId })) {
    return res.status(400).json({ message: "bookId and copyId are required" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE copies SET bookId = ?, copyId = ?, available = ? WHERE id = ?",
      [bookId, copyId, available ? 1 : 0, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Copy not found" });
    res.json({ message: "Copy updated" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "CopyId already exists" });
    }
    console.error(err);
    res.status(500).json({ message: "Failed to update copy" });
  }
};

// Delete a copy
exports.deleteCopy = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM copies WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Copy not found" });
    res.json({ message: "Copy deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete copy" });
  }
};
