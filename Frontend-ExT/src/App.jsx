import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Filter from './pages/Filter'
import Category from './pages/Category'
import Expense from './pages/Expense'
import Income from './pages/Income'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Bills from './pages/Bills'
import Budget from './pages/Budget'
import LandingPage from './pages/Landing'

// 🔒 Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

          {/* Protected Routes */}
          <Route path='/dashboard' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/income' element={<ProtectedRoute><Income /></ProtectedRoute>} />
          <Route path='/expense' element={<ProtectedRoute><Expense /></ProtectedRoute>} />
          <Route path='/category' element={<ProtectedRoute><Category /></ProtectedRoute>} />
          <Route path='/filter' element={<ProtectedRoute><Filter /></ProtectedRoute>} />
          <Route path='/bills' element={<ProtectedRoute><Bills /></ProtectedRoute>} />
          <Route path='/budget' element={<ProtectedRoute><Budget /></ProtectedRoute>} />
          {/* (Optional) Calendar also protected if you want */}
          {/* <Route path='/calendar' element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
