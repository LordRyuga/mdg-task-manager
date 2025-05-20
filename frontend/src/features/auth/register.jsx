import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './login.jsx';
import axios from "axios";
import Navbar from '../../assets/navbar.jsx';
import LoginPage, { Username, Password, Submit, Title, Logo, Reset, Footer } from '@react-login-page/base';
import LoginLogo from 'react-login-page/logo';


const styles = {height: 500, width: 400, marginLeft: '25rem'};

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        isStudent: true,
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
            const response = await axios.post("http://localhost:5173/api/auth/users/register/", form);
            console.log(response.data);
            navigate("/login");
        } catch (error) {
            console.error("Error registering user:", error);
        }
    }


    return (
        <div className="signup-container">
            <Navbar />

            <div style={styles}>
                <LoginPage>
                    <Username placeholder="Username" onChange={handleChange} keyname="username" index={0}/>
                    <Username placeholder="First name" onChange={handleChange} keyname="firstName" index={1}/>
                    <Username placeholder="Last Name" onChange={handleChange} keyname="lastName" index={2}/>
                    <Username placeholder="E-mail" onChange={handleChange} keyname="email" index={3}/>
                    <Password placeholder="Password" onChange={handleChange} index={4}/>
                    <Submit onClick={handleSubmit} />
                    <Title>Login</Title>
                    <Username keyname="checkbox" type="checkbox" onChange={handleChange} name="isStudent" index={5} style={{width: 'auto'}} defaultChecked={true}>
                        <div style={{ fontSize: 14, display: 'flex', justifyContent: 'space-between', flex: 1 }}>
                            <div>Are you a student?</div>
                        </div>
                    </Username>
                    <Logo>
                        <LoginLogo />
                    </Logo>

                </LoginPage>
            </div>
        </div>
    );
}

export default Register;