const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    college: { type: String },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "user" },
  },
  { timestamps: true } // auto adds createdAt, updatedAt
);

module.exports = mongoose.model("User", UserSchema);
