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

    const fetchAllAssignments = async () => {
            try {
                const response = await axios.get('/api/classrooms/getAllAssignments', { params: { class_id: classId } }, { withCredentials: true });
                setAssignments(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching assignments', error);
            }
        };

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
            fetchAllAssignments();
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
        <div className="assignmentPage" style={{ marginTop: '5rem' }}>
            <Navbar />
            <div className="classroom-header" style={{ alignItems: 'center', marginTop: '7rem' }}>
                <h2>Hello {userData.firstName} {userData.lastName}</h2>
                <h2>Classroom ID: {classId}</h2>
            </div>
            {userData && !userData.isStudent && (
                <div className="create-Ass">
                    <form onSubmit={handleSubmit}>
                        {/* First Row: Three Inputs Side-by-Side */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Assignment Name"
                                value={createAssignmentForm.name}
                                onChange={handleChange}
                                required
                                style={{
                                    flex: 1,
                                    border: '0.1rem solid #41414f',
                                    padding: '0.5rem',
                                    backgroundColor: '#41414f',
                                }}
                            />
                            <input
                                type="text"
                                name="total_Marks"
                                placeholder="Total Marks"
                                value={createAssignmentForm.total_Marks}
                                onChange={handleChange}
                                required
                                style={{
                                    flex: 1,
                                    border: '0.1rem solid #41414f',
                                    padding: '0.5rem',
                                    backgroundColor: '#41414f',
                                }}
                            />
                            <input
                                type="text"
                                name="descriptionUrl"
                                placeholder="URL to assignment pdf"
                                value={createAssignmentForm.descriptionUrl}
                                onChange={handleChange}
                                required
                                style={{
                                    flex: 1,
                                    border: '0.1rem solid #41414f',
                                    padding: '0.5rem',
                                    backgroundColor: '#41414f',
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <textarea
                                name="instructions"
                                placeholder="Instructions to assignment"
                                value={createAssignmentForm.instructions}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '75rem',
                                    height: '10rem',
                                    border: '0.1rem solid #41414f',
                                    padding: '0.75rem',
                                    backgroundColor: '#41414f',
                                }}
                            />
                        </div>

                        {/* Date Picker */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <input
                                type="datetime-local"
                                name="dueDate"
                                value={createAssignmentForm.dueDate}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    border: '0.1rem solid #41414f',
                                    padding: '0.5rem',
                                    backgroundColor: '#41414f',
                                }}
                            />
                        </div>

                        {/* Submit Button */}
                        <button type="submit" style={{ padding: '0.6rem 1.2rem' }}>Create Assignment</button>
                    </form>
                </div>

            )}
            <h2 style={{ marginTop: '2rem' }}>Assignments</h2>
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

        </div>
    );




}

export default classRoomPage