import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import CourseCodes  from './CourseCodes'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import ForgotPassword from './ForgotPassword'
function App() {


  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Signup />}></Route>
          <Route path='/register' element={<Signup />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/forgot-password' element={<ForgotPassword />}></Route>
          <Route path='/course-codes' element={<CourseCodes />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
