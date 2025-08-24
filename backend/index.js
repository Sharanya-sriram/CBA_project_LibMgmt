const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const bookRoutes= require("./routes/books");
const copiesRoutes = require("./routes/copies");
const userRoutes = require("./routes/users");
const issuedBooksRoutes = require("./routes/issuedBooks");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true, // allow cookies to be sent
}));
app.use("/api/auth", authRoutes);

// Example test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// TODO: Import and use your routes here
app.use("/api/books", bookRoutes);
app.use("/api/copies", copiesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/issuedBooks", issuedBooksRoutes);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
