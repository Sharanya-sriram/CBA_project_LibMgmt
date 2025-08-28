const Member = require("../models/Member");

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get members" });
  }
};

// Get member by ID
exports.getMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const member = await Member.findById(id);
    if (!member) return res.status(404).json({ message: "Member not found" });
    res.json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get member" });
  }
};

// Create a new member
exports.createMember = async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    const newMember = new Member({ name, email, phone });
    const savedMember = await newMember.save();
    res.status(201).json({ id: savedMember._id, message: "Member created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create member" });
  }
};

// Update a member
exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true }
    );

    if (!updatedMember) return res.status(404).json({ message: "Member not found" });

    res.json({ message: "Member updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update member" });
  }
};

// Delete a member
exports.deleteMember = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMember = await Member.findByIdAndDelete(id);
    if (!deletedMember) return res.status(404).json({ message: "Member not found" });

    res.json({ message: "Member deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete member" });
  }
};
 
