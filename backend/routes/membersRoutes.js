const express = require("express");
const router = express.Router();
const membersController = require("../controllers/membersController");

// Get all members
router.get("/", membersController.getAllMembers);

// Get a member by ID
router.get("/:id", membersController.getMemberById);

// Create a new member
router.post("/", membersController.createMember);

// Update a member
router.put("/:id", membersController.updateMember);

// Delete a member
router.delete("/:id", membersController.deleteMember);

module.exports = router;
 
