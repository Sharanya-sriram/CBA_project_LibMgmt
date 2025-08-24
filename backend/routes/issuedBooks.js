const express = require("express");
const router = express.Router();
const issuedBooksController = require("../controllers/issuedBooksController");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);
router.get("/", issuedBooksController.getAllIssuedBooks);
router.get("/:id", issuedBooksController.getIssuedBookById);
router.post("/", issuedBooksController.createIssuedBook);
router.put("/:id", issuedBooksController.updateIssuedBook);
router.delete("/:id", issuedBooksController.deleteIssuedBook);

module.exports = router;
