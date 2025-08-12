// src/api/http-common.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // json-server base
  headers: {
    "Content-Type": "application/json",
  },
});

const api = {
  // Books
  getBooks: () => API.get("/books"),
  getBook: (id) => API.get(`/books/${id}`),
  addBook: (book) => API.post("/books", book),
  updateBook: (id, updatedBook) => API.put(`/books/${id}`, updatedBook),
  deleteBook: (id) => API.delete(`/books/${id}`),

  // Copies update only
  updateBookCopies: (id, copies) =>
    API.put(`/books/${id}`, { copies }),

  // Issued books
  getIssuedBooks: () => API.get("/issuedBooks"),
  addIssuedBook: (issuedBook) => API.post("/issuedBooks", issuedBook),
  deleteIssuedBook: (id) => API.delete(`/issuedBooks/${id}`),
  getDetails: (issuedBookId) => API.get(`/issuedBooks/details/${issuedBookId}`),
  // Users
  getUsers: () => API.get("/users"),
  getUser: (id) => API.get(`/users/${id}`),
  addUser: (user) => API.post("/users", user),
  updateUser: (id, updatedUser) => API.put(`/users/${id}`, updatedUser),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

export default api;
