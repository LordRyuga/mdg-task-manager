import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from '../../assets/navbar.jsx';
import { useUser } from "../profile/userContext.jsx";
import { useParams } from "react-router-dom";
import AssignmentCard from "../../assets/assignmentCard.jsx";

const classRoomPage = () => {

    //fetching all assignments of this classroom from the backend
    const [assignments, setAssignments] = useState([]);
    const { userData } = useUser();

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
        try {
            const dataToSend = {
                ...createAssignmentForm,
                dueDate: new Date(createAssignmentForm.dueDate).toISOString(),
                total_Marks: parseInt(createAssignmentForm.total_Marks),
            };
            const response = await axios.post("http://localhost:5173/api/assignment/createAssignment/", dataToSend, { withCredentials: true });

        } catch (error) {
            console.error("Error creating assignment", error);
        }
    }

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get('/api/classrooms/getAllAssignments', { params: { class_id: classId } }, { withCredentials: true });
                setAssignments(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching assignments', error);
            }
        };

        fetchAssignments();
    }, [classId]);

    return (
        <div className="assignmentPage">
            <Navbar />
            <div className="assignment-cards-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px' }}>
                {assignments.map(assignment => (
                    <AssignmentCard
                        key={assignment.ass_id}
                        ass_id={assignment.ass_id}
                        name={assignment.name}
                        description={assignment.instructions}
                        total_Marks={assignment.total_Marks}
                        dueDate={assignment.dueDate}
                    />
                ))}
            </div>

            {userData && !userData.isStudent && (
                <div className="create-Ass">
                    <form onSubmit={handleSubmit}>
                        {/* make input fields corresponding to the createAssignmentForm */}

                        <input type="text" name="name" placeholder="Classroom Name" value={createAssignmentForm.name} onChange={handleChange} required />
                        <br></br>
                        <input type="text" name="total_Marks" placeholder="Total Marks" value={createAssignmentForm.total_Marks} onChange={handleChange} />
                        <br></br>
                        <input type="text" name="descriptionUrl" placeholder="URL to assignment pdf" value={createAssignmentForm.descriptionUrl} onChange={handleChange} />
                        <br></br>
                        <textarea name="instructions" placeholder="Instructions to assignment" value={createAssignmentForm.instructions} onChange={handleChange} />
                        <br></br>
                        <input type="date" name="dueDate" placeholder="Total Marks" value={createAssignmentForm.dueDate} onChange={handleChange} />
                        <button type="submit">Create Assignment</button>
                    </form>
                </div>
            )}
        </div>
    );




}

export default classRoomPage