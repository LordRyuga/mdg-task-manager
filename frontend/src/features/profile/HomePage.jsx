import React, { use, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../../assets/navbar.jsx';
import { useUser } from "./userContext.jsx";
import { useUserClassroom } from "./userClassroomsContext.jsx";
import Card from '../../assets/Card.jsx';



const HomePage = () => {

    //fetching all classrooms from the backend
    const navigate = useNavigate();
    const [classrooms, setClassrooms] = useState([]);
    const { userData } = useUser();
    const { userClassrooms ,fetchUserClassrooms } = useUserClassroom();

    useEffect(() => {
        const fetchClassrooms = async () => {
            setClassrooms(userClassrooms);
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
        description: "",
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
            const response = await axios.post("http://localhost:5173/api/classrooms/joinClassroom/", joinClassForm, { withCredentials: true });
            await fetchUserClassrooms();
            // console.log(response.data);
            navigate("/profile");
        } catch (error) {
            console.error("Error joining classroom:", error);
        }
    }
    const handleSubmitCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5173/api/classrooms/createClassroom/", createClassForm, { withCredentials: true });
            await fetchUserClassrooms();
            // console.log(response.data);
            navigate("/profile");
        } catch (error) {
            console.error("Error creating classroom:", error);
        }
    }

    if (userData === null) {
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
        <div className="home-container" style={ { marginRight: '5%', padding: 0, marginTop: '8rem'}}>
            <Navbar />
            <div className="goodLooksBro" style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', marginRight: '5rem', marginLeft: '7rem' } }>
                <h2>Home Page</h2>
                <form onSubmit={handleSubmitJoin}>
                    <input type="text" name="class_id" placeholder="Classroom ID" value={joinClassForm.class_id} onChange={handleChangeJoin} required />
                    <br></br>
                    <button type="submit">Join Classroom</button>
                </form>
                {userData && !userData.isStudent && (
                    <form onSubmit={handleSubmitCreate}>
                        <input type="text" name="classroom_name" placeholder="Classroom Name" value={createClassForm.classroom_name} onChange={handleChangeCreate} required />
                        <br></br>
                        <input type="text" name="description" placeholder="Description" value={createClassForm.description} onChange={handleChangeCreate} />
                        <br></br>
                        <button type="submit">Create Classroom</button>
                    </form>
                )}

            </div>
            <div className="classroomCards" style={ { display: 'flex', flexWrap: 'wrap', justifyContent: 'center' } }>
                {classrooms && classrooms.map(classroom => (
                    <span className="classroomCard" style={ { display: 'flex', justifyContent: 'center', margin: '1em' } } key={classroom.class_id}>
                        <Card name={classroom.name} description={classroom.description} class_id={classroom.class_id} />
                    </span>
                ))}
            </div>
        </div>
    )
}

export default HomePage;