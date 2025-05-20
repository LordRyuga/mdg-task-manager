import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import axios from "axios";
import Navbar from '../../assets/navbar.jsx';
import { useUser } from "../profile/userContext.jsx";
import { useParams } from "react-router-dom";


const classRoomPage = () => {
    
    //fetching all assignments of this classroom from the backend
    const [assignments , setAssignments] = useState([]);
    const {userData} = useUser();
    
    const classId = useParams().class_id;

    const [createAssignmentForm, setForm] = useState(
        {
            name: "",
            class_id: parseInt(classId),
            total_Marks: "",
            descriptionUrl: "",
            instructions: "",
            dueDate: "",
        }
    )

    

    const handleChange = (e) => {
        setForm({
            ...createAssignmentForm,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const dataToSend = {
                ...createAssignmentForm,
                dueDate: new Date(createAssignmentForm.dueDate).toISOString(),
                total_Marks: parseInt(createAssignmentForm.total_Marks),
            };
            const response = await axios.post("http://localhost:5173/api/assignment/createAssignment/", dataToSend, {withCredentials: true});

        }catch(error)
        {
            console.error("Error creating assignment", error);
        }
    }

    useEffect( () => 
    {
        const fetchAssignments = async () => {
            try
            {
                const response = await axios.get('/api/classrooms/getAllAssignments', {params: {class_id: classId}}, {withCredentials: true});
                setAssignments(response.data);
                console.log(response.data);
            }catch(error)
            {
                console.error('Error fetching assignments', error);
            }
        };

        fetchAssignments();
    }, []);

    return(
        <div className="assignmentPage">
            <Navbar />
            <ul>
                {assignments.map(assignments => (
                    <li key={assignments.ass_id}>
                        <Link to={`/assignment/${assignments.ass_id}`}>{assignments.name}</Link>
                    </li>
                ))}
            </ul>

            <div className="create-Ass">
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Assignment Name"
                        value={createAssignmentForm.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="total_Marks"
                        placeholder="Total Marks"
                        value={createAssignmentForm.total_Marks}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="url"
                        name="descriptionUrl"
                        placeholder="Url to assignment pdf"
                        value={createAssignmentForm.descriptionUrl}
                        onChange={handleChange}
                    />
                    <textarea
                        name="instructions"
                        placeholder="Instructions of assignment"
                        value={createAssignmentForm.instructions}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="datetime-local"
                        name="dueDate"
                        // also want to convert date to iso so that backend can parse it
                        value={createAssignmentForm.dueDate}
                        onChange={handleChange}
                        required 
                    />

                    <button type="submit">Create Assignment</button>
                </form>
            </div>
        </div>
    )



}

export default classRoomPage