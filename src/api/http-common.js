// src/api/http-common.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001", // your json-server base
  headers: {
    "Content-Type": "application/json",
  },
});

// 👇 API methods
const api = {
  getBooks: () => API.get("/books"),
  getBook: (id) => API.get(`/books/${id}`),
  addBook: (book) => API.post("/books", book),
  updateBook: (id, updatedBook) => API.put(`/books/${id}`, updatedBook),
  deleteBook: (id) => API.delete(`/books/${id}`),
  getIssuedBooks: () => API.get("/issuedBooks"),

  getUsers: () => API.get("/users"),
  getUser: (id) => API.get(`/users/${id}`),
  addUser: (user) => API.post("/users", user),
  updateUser: (id, updatedUser) => API.put(`/users/${id}`, updatedUser),
  deleteUser: (id) => API.delete(`/users/${id}`),
};

export default api;
