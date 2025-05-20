import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Navbar from '../../assets/navbar.jsx';
import { useUser } from "./userContext.jsx";


const HomePage = () => {

    //fetching all classrooms from the backend
    const navigate = useNavigate();
    const [classrooms, setClassrooms] = useState([]);
    const {userData} = useUser();
    console.log(userData);
  
    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const response = await axios.get('/api/classrooms/getAllClassrooms/');
                console.log(response.data);
                setClassrooms(response.data);
            } catch (error) {
                console.error('Error fetching classrooms:', error);
            }
        };

        fetchClassrooms();
    }, []);



    // creating a form which has classroom_id for joining a classroom
    const [joinClassForm, setForm] = useState({
        class_id: "",
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
            // console.log(response.data);
            navigate("/profile");
        } catch (error) {
            console.error("Error joining classroom:", error);
        }
    }
    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5173/api/classrooms/createClassroom/", createClassForm, {withCredentials: true});
            // console.log(response.data);
            navigate("/profile");
        } catch (error) {
            console.error("Error creating classroom:", error);
        }
    }

    
    return(
        <div className="home-container">
            <Navbar/>
            <h2>Home Page</h2>
            <form onSubmit={handleSubmitJoin}>
                <input type="text" name="class_id" placeholder="Classroom ID" value={joinClassForm.class_id} onChange={handleChangeJoin} required />
                <button type="submit">Join Classroom</button>
            </form>
            {userData && !userData.isStudent && (
                <form onSubmit={handleSubmitCreate}>
                    <input type="text" name="classroom_name" placeholder="Classroom Name" value={createClassForm.classroom_name} onChange={handleChangeCreate} required />
                    <button type="submit">Create Classroom</button>
                </form>
            )}
            <ul>
              {classrooms.map(classroom => (
                <li key={classroom.class_id}>
                  <Link to={`/classroom/${classroom.class_id}`}>{classroom.name}</Link>
                </li>
              ))}
            </ul>
        </div>
    )
}

export default HomePage;