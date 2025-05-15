import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Navbar from '../../assets/navbar.jsx';


const HomePage = () => {
    //Getting the user data from the backend
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
                const response = await axios.get("http://localhost:5173/api/auth/users/get_user/", {withCredentials: true});
                setUserData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);


    const navigate = useNavigate();
    // creating a form which has classroom_id for joining a classroom
    const [joinClassForm, setForm] = useState({
        classroom_id: "",
    });
    //creating a form which has classroom_name for creating a classroom
    const [createClassForm, setForm1] = useState({
        classroom_name: "",
    });

    //handling the change in both the forms and submitting both the forms
    const handleChangeJoin = (e) => {
        setForm({
            ...joinClassForm,
            [e.target.name]: e.target.value,
        });
    }
    const handleChangeCreate = (e) => {
        setForm1({
            ...createClassForm,
            [e.target.name]: e.target.value,
        });
    }
    const handleSubmitJoin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5173/api/classrooms/joinClassroom/", joinClassForm, {withCredentials: true});
            console.log(response.data);
            navigate("/profile");
        } catch (error) {
            console.error("Error joining classroom:", error);
        }
    }
    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5173/api/classrooms/createClassroom/", createClassForm, {withCredentials: true});
            console.log(response.data);
            navigate("/profile");
        } catch (error) {
            console.error("Error creating classroom:", error);
        }
    }

    
    return(
        <div className="home-container">
            <h2>Home Page</h2>
            <form onSubmit={handleSubmitJoin}>
                <input type="text" name="classroom_id" placeholder="Classroom ID" value={joinClassForm.classroom_id} onChange={handleChangeJoin} required />
                <button type="submit">Join Classroom</button>
            </form>
            {userData && !userData.isStudent && (
                <form onSubmit={handleSubmitCreate}>
                    <input type="text" name="classroom_name" placeholder="Classroom Name" value={createClassForm.classroom_name} onChange={handleChangeCreate} required />
                    <button type="submit">Create Classroom</button>
                </form>
            )}
        </div>
    )
}

export default HomePage;