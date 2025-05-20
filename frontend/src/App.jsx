import React, { useState } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './features/auth/login'

import Register from './features/auth/register'
import ProfilePage from './features/profile/profilePage'
import HomePage from './features/profile/HomePage'
import AssignmentCalendarPage from './features/assignments/assignmentCalendar'
import ClassroomPage from './features/classroooms/classroom'
import { UserContextProvider } from './features/profile/userContext'
import { UserClassroomContextProvider } from './features/profile/userClassroomsContext'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { green } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#28283d', // Main background
      paper: '#11113d',   // Card background
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
    divider: '#333',
    accent: green[500], // Example accent color
  },
});

import './App.css'
import AssignmentPage from './features/assignments/assignment'


function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <UserContextProvider>
        <UserClassroomContextProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path='/home' element={<HomePage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/classroom/:class_id" element={<ClassroomPage />} />
                <Route path="assignment/:ass_id" element={<AssignmentPage />} />
                <Route path="/calendar" element={<AssignmentCalendarPage />} />
                <Route path='/' element={<Login />} />
              </Routes>
            </div>
          </Router>
        </UserClassroomContextProvider>
      </UserContextProvider>
    </ThemeProvider>
  )
}

export default App
