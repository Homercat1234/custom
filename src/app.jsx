import React from "react";
import Navbar from "./components/navbar";
import FourOFour from "./pages/404";
import Blog from "./pages/blog";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" index element={<Home />} />
          <Route path="/home" index element={<Home />} />
          <Route path="/index" index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/*" element={<FourOFour />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
