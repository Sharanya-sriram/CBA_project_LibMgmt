const IssuedBook= require("../models/IssuedBooks");
const Copy = require("../models/Copy");
// Get all issued books
exports.getAllIssuedBooks = async (req, res) => {
  try {
    // fetch all issued books, with optional population of user and book
    const issuedBooks = await IssuedBook.find()
     // populate selected user fields
      .populate("bookId");  // populate selected book fields

    res.json(issuedBooks);
  } catch (err) {
    console.error("Error fetching issued books:", err);
    res.status(500).json({ message: "Failed to get issued books" });
  }
};

// Get issued book by ID
exports.getIssuedBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const issuedBook = await IssuedBook.findById(id)
      .populate("userId", "username email") // optional: show related user
      .populate("bookId", "title author");  // optional: show related book

    if (!issuedBook) {
      return res.status(404).json({ message: "Issued book not found" });
    }

    res.json(issuedBook);
  } catch (err) {
    console.error("Error fetching issued book by ID:", err);
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
    // 1. Check if the copy is available
    const copy = await Copy.findOne({ copyId });
    if (!copy) {
      return res.status(404).json({ message: "Copy not found" });
    }
    if (!copy.available) {
      return res.status(400).json({ message: "Copy is already issued" });
    }

    // 2. Create issued book record
    const issuedBook = new IssuedBook({
      userId,
      bookId,
      copyId,
      issueDate,
      returnDate,
    });
    const savedIssuedBook = await issuedBook.save();

    // 3. Update copy availability to false (unavailable)
    copy.available = false;
    await copy.save();

    res.status(201).json({
      id: savedIssuedBook._id,
      message: "Book copy issued successfully",
    });
  } catch (err) {
    console.error("Error issuing book:", err);
    res.status(500).json({ message: "Failed to issue book copy" });
  }
};


// Update issued book (e.g. to add returnDate)
exports.updateIssuedBook = async (req, res) => {
  const { id } = req.params;
  const { userId, bookId, copyId, issueDate, returnDate } = req.body;

  try {
    // Format issueDate if provided
    const modIssueDate = issueDate ? new Date(issueDate) : null;

    // 1. Update issued book document
    const issuedBook = await IssuedBook.findByIdAndUpdate(
      id,
      {
        userId,
        bookId,
        copyId,
        issueDate: modIssueDate,
        returnDate,
      },
      { new: true } // return updated document
    );

    if (!issuedBook) {
      return res.status(404).json({ message: "Issued book not found" });
    }

    // 2. If returnDate is set, mark copy available again
    if (returnDate && copyId) {
      await Copy.findOneAndUpdate({ copyId }, { available: true });
    }

    res.json({ message: "Issued book updated", issuedBook });
  } catch (err) {
    console.error("Error updating issued book:", err);
    res.status(500).json({ message: "Failed to update issued book" });
  }
};

// Delete an issued book entry (return book)
// controllers/issuedBookController.js
exports.deleteIssuedBook = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Find issued book first (to get copyId)
    const issuedBook = await IssuedBook.findById(id);
    if (!issuedBook) {
      return res.status(404).json({ message: "Issued book not found" });
    }

    const { copyId } = issuedBook;

    // 2. Delete issued book record
    await IssuedBook.findByIdAndDelete(id);

    // 3. Mark the copy available again
    if (copyId) {
      await Copy.findOneAndUpdate({ copyId }, { available: true });
    }

    res.json({ message: "Issued book deleted (book returned)" });
  } catch (err) {
    console.error("Error deleting issued book:", err);
    res.status(500).json({ message: "Failed to delete issued book" });
  }
};
