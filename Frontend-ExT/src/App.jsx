import React from 'react'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Filter from './pages/Filter'
import Category from './pages/Category'
import Expense from './pages/Expense'
import Income from './pages/Income'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <>
      <Toaster/>
      <BrowserRouter>
        <Routes>
          <Route path='/dashboard' element={<Home />} />
          <Route path='/income' element={<Income />} />
          <Route path='/expense' element={<Expense />} />
          <Route path='/category' element={<Category />} />
          <Route path='/filter' element={<Filter />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;