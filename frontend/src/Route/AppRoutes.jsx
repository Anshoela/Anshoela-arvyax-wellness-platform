import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../components/Login'
import Register from '../components/Register'
import MySessions from '../components/MySession'
import AddSession from '../components/AddSession'
import Dashboard from '../components/Dashboard'

const AppRoutes = () => {
  return (
    <div>
         
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/mySession" element={<MySessions/>} />
            <Route path="/addSession" element={<AddSession/>} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    
    </div>
  )
}

export default AppRoutes