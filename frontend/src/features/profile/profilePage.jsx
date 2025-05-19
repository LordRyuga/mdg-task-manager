import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../../assets/navbar.jsx';
import { Link } from "react-router-dom";

const profilePage = () => {

    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        isStudent: true,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:5173/api/auth/users/get_user/", { withCredentials: true });
                setUserData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        document.cookie.split(";").forEach((cookie) => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
            navigate("/login");
        });
        window.location.reload();
    };

    console.log(userData);

    if (userData.username === '') {
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
            <h2>User Profile</h2>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>First Name:</strong> {userData.firstName}</p>
            <p><strong>Last Name:</strong> {userData.lastName}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default profilePage;