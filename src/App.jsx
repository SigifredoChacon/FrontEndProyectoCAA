
import './App.css'
import UsersPage from "./pages/UserPage.jsx";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



function App() {


  return (
      <Router>
          <Routes>
              <Route path="/users/*" element={<UsersPage />} /> {/* El asterisco permite que las rutas anidadas coincidan */}
          </Routes>
      </Router>
  )
}

export default App
