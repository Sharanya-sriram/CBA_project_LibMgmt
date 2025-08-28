const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/users");
const bookRoutes = require("./routes/books");
const copyRoutes = require("./routes/copies");
const issuedBookRoutes = require("./routes/issuedBooks");
const memberRoutes = require("./routes/membersRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/copies", copyRoutes);
app.use("/api/issuedBooks", issuedBookRoutes);
app.use("/api/members", memberRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
