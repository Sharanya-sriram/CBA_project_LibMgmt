// src/api/http-common.js
import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Backend API base
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const api = {
  // Books
  getBooks: () => API.get("/books"),
  getBook: (id) => API.get(`/books/${id}`),
  addBook: (book) => API.post("/books", book),
  updateBook: (id, updatedBook) => API.put(`/books/${id}`, updatedBook),
  deleteBook: (id) => API.delete(`/books/${id}`),

  // Copies
  getCopies: () => API.get("/copies"),
  getCopiesByBookId: (bookId) => API.get(`/copies/book/${bookId}`),
  addCopy: (copy) => API.post("/copies", copy),
  updateCopy: (id, updatedCopy) => API.put(`/copies/${id}`, updatedCopy),
  deleteCopy: (id) => API.delete(`/copies/${id}`),

  // Issued books
  getIssuedBooks: () => API.get("/issuedBooks"),
  getIssuedBook: (id) => API.get(`/issuedBooks/${id}`),
  addIssuedBook: (issuedBook) => API.post("/issuedBooks", issuedBook),
  updateIssuedBook: (id, updatedIssuedBook) => API.put(`/issuedBooks/${id}`, updatedIssuedBook),
  deleteIssuedBook: (id) => API.delete(`/issuedBooks/${id}`),

  // Users
  getUsers: () => API.get("/users"),
  getUser: (id) => API.get(`/users/${id}`),
  addUser: (user) => API.post("/users", user),
  updateUser: (id, updatedUser) => API.put(`/users/${id}`, updatedUser),
  deleteUser: (id) => API.delete(`/users/${id}`),
  loginUser: (credentials) => API.post("/auth/login", credentials),
  registerUser: (data) => API.post("/auth/register", data),

  // New endpoints
  getCurrentUser: () => API.get("/auth/me"),  
  logoutUser: () => API.post("/auth/logout"),
};

export default api;
