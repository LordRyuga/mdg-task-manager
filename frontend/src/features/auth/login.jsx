import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const login = () => {

    const navigate = useNavigate();

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
            navigate("/profile");
        } catch (error) {
            console.error("Error logging in user:", error);
        }
    }
    return(
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
            <button onClick={ async () => {
                try {
                    const response = await axios.get("http://localhost:5173/api/auth/users/get_user/", {withCredentials: true});
                    console.log(response.data);
                } catch (error) {
                    console.error("Error getting user data:", error);
                }
            }}>Get User Data</button>
           <button
            onClick={() => {
                document.cookie.split(";").forEach((cookie) => {
                    const name = cookie.split("=")[0].trim();
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
                });
            }}>LogOut</button>
            <div>
                <p>Don't Have An Account? Register here:</p>
                <button onClick={() => navigate("/register")}>Register</button>
            </div>
            
        </div>
    );
}

export default login;