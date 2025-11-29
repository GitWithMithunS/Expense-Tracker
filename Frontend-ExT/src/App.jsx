import React from 'react'
import { BrowserRouter, Routes , Route, Navigate } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Filter from './pages/Filter'
import Category from './pages/Category'
import Expense from './pages/Expense'
import Income from './pages/Income'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Bills from './pages/Bills'
import CalendarPage from './pages/CalendarPage'
import Budget from './pages/Budget'

const App = () => {
  return (
    <>
      <Toaster/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Root />} />
          <Route path='/dashboard' element={<Home />} />
          <Route path='/income' element={<Income />} />
          <Route path='/expense' element={<Expense />} />
          <Route path='/category' element={<Category />} />
          <Route path='/filter' element={<Filter />} />
          <Route path='/bills' element={<Bills />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path="/budget" element={<Budget />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to='/dashboard'/>
  ) : (
    <Navigate to='/login' />
  )
}

export default App;