const Copy = require("../models/Copy");

// Get all copies
exports.getAllCopies = async (req, res) => {
  try {
    const copies = await Copy.find().populate("bookId");
    res.json(copies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get copies by bookId
exports.getCopiesByBook = async (req, res) => {
  try {
    const copies = await Copy.find({ bookId: req.params.bookId }).populate("bookId");
    res.json(copies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new copy
exports.createCopy = async (req, res) => {
  try {
    const { bookId, status } = req.body;
    const copy = new Copy({ bookId, status });
    await copy.save();
    res.status(201).json(copy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a copy by id
exports.updateCopy = async (req, res) => {
  try {
    const copy = await Copy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(copy);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a copy by id
exports.deleteCopy = async (req, res) => {
  try {
    await Copy.findByIdAndDelete(req.params.id);
    res.json({ message: "Copy deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
