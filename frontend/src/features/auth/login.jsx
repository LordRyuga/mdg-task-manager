import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { useUser } from "../profile/userContext";
import { useUserClassroom } from "../profile/userClassroomsContext";
import Navbar from '../../assets/navbar.jsx';
import LoginPage, { Username, Password, Submit, Title, Logo, Reset, Footer } from '@react-login-page/base';
import LoginLogo from 'react-login-page/logo';


const styles = {height: 500, width: 400, marginLeft: '25rem'};

const login = () => {

    const navigate = useNavigate();
    const { setUserData } = useUser();
    const { fetchUserClassrooms } = useUserClassroom();

    const [form, setForm] = useState({
            username: "",
            password: "",
        });
    
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5173/api/token/", form, {withCredentials: true});
            console.log(response.data);
            document.cookie = `access=${response.data.access}; path=/; secure;`;
            document.cookie = `refresh=${response.data.refresh}; path=/; secure;`;

            const response2 = await axios.get("http://localhost:5173/api/auth/users/get_user/", { withCredentials: true });
            await setUserData(response2.data);
            await fetchUserClassrooms();
            navigate("/profile");
        } catch (error) {
            console.error("Error logging in user:", error);
        }
    }
    return(
        <div className="login-container">
            <Navbar />

            <div style={styles}>
                <LoginPage>
                    <Username placeholder="Username" onChange={handleChange} />
                    <Password placeholder="Password" onChange={handleChange} />
                    <Submit onClick={handleSubmit} />
                    <Title>Login</Title>
                    <Logo>
                        <LoginLogo />
                    </Logo>
                    <Footer>Don't have an account? Register  
                        <Link to="/register"> here</Link>
                    </Footer>
                    
                </LoginPage>
            </div>
        </div>
    );
}

export default login;