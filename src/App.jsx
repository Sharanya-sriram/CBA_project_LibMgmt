import React from 'react'
import Home from './pages/Home.jsx'
import MyBooks from './pages/MyBooks.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/Navbar.jsx'
import './index.css'
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mybooks" element={<MyBooks />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
