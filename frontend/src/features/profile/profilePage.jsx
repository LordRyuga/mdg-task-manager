import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../../assets/navbar.jsx';
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { useUser } from "./userContext.jsx";

const profilePage = () => {

    const navigate = useNavigate();

    const { userData } = useUser();

    const handleLogout = () => {
        document.cookie.split(";").forEach((cookie) => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
            navigate("/login");
        });
        window.location.reload();
    };

    console.log(userData);

    if (userData === null || userData.username === '') {
        return (
            <div className="home-container">
                <Navbar />
                <h2>Please Login to access this page</h2>
                <Link to="/login">Login</Link>
                <br></br>
                <Link to="/register">Register</Link>
            </div>
        )
    }

    return (
        <div className="profile-container">
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.25em', zIndex: 100 }}>
                <Avatar
                    sx={{ width: 100, height: 100 }}
                />
            </div>
            <div className="welcome-back" style={{ marginTop: '2rem', marginLeft: 'auto' }}>
                <h2>Welcome back, <strong>{userData.username}</strong></h2>
                <h3>Your Profile</h3>
                <p style={{ fontSize: '1.5rem' }}><strong>Email:</strong> {userData.email}</p>
                <p style={{ fontSize: '1.5rem' }}><strong>First Name:</strong> {userData.firstName}</p>
                <p style={{ fontSize: '1.5rem' }}><strong>Last Name:</strong> {userData.lastName}</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
}

export default profilePage;