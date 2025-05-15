import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const profilePage = () => {

    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:5173/api/auth/users/get_user/", {withCredentials: true});
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

    return(
        <div className="profile-container">
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