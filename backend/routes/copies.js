const express = require("express");
const router = express.Router();
const copiesController = require("../controllers/copiesController");

// Get all copies
router.get("/", copiesController.getAllCopies);

// Get copies by book id
router.get("/book/:bookId", copiesController.getCopiesByBook);

// Add a new copy
router.post("/", copiesController.createCopy);

// Update a copy by id
router.put("/:id", copiesController.updateCopy);

// Delete a copy by id
router.delete("/:id", copiesController.deleteCopy);

module.exports = router;
