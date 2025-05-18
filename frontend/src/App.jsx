import React, { useState } from 'react'
import axios from 'axios'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './features/auth/login'

import Register from './features/auth/register'
import ProfilePage from './features/profile/profilePage'
import HomePage from './features/profile/HomePage'
import ClassroomPage from './features/classroooms/classroom'
import { UserContextProvider } from './features/profile/userContext'

import './App.css'



function App() {
  return (
    <UserContextProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path='/home' element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/classroom/:class_id" element={<ClassroomPage />} />
          </Routes>
        </div>
      </Router>
    </UserContextProvider>
  )
}

export default App
