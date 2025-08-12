const pool = require("../config/db");

const selectFields = "id, name, username, age, college, email, createdAt, role";

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT ${selectFields} FROM users`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users" });
  }
};

// Get user by id
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [[user]] = await pool.query(`SELECT ${selectFields} FROM users WHERE id = ?`, [id]);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get user" });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { name, username, password, age, college, email, role } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO users (name, username, password, age, college, email, role) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, username, password, age, college, email, role || 'user']
    );
    res.status(201).json({ id: result.insertId, message: "User created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, username, password, age, college, email, role } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE users SET name = ?, username = ?, password = ?, age = ?, college = ?, email = ?, role = ? WHERE id = ?",
      [name, username, password, age, college, email, role || 'user', id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user" });
  }
};
