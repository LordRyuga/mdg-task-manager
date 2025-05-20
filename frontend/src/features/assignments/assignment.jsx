import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from '../../assets/navbar.jsx';
import { useUser } from "../profile/userContext.jsx";

const AssignmentPage = () => {
    const assId = useParams().ass_id;
    const [assignment, setAssignment] = useState(null);
    const [studentSubmission, setStudentSubmission] = useState("");
    const [studentMarks, setStudentMarks] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [marksMap, setMarksMap] = useState({});
    
    
    const { userData } = useUser();
    console.log(userData)
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5173/api/assignment/getAssignmentById/', {
                    params: { ass_id: assId },
                    withCredentials: true,
                });
                setAssignment(response.data);

                if (userData && !userData.isStudent) {
                    
                    const response = await axios.get('http://localhost:5173/api/assignment/submissionStatus/', {
                        params: { ass_id: assId },
                        withCredentials: true,
                    });
                    setSubmissions(response.data);
                } else if(userData){
                    const response = await axios.get('http://localhost:5173/api/assignment/submission/', {
                        params: { ass_id: assId },
                        withCredentials: true,
                    });
                    setStudentSubmission(response.data.submitted_url);
                    setStudentMarks(response.data.marks);
                }
            } catch (error) {
                console.error('Error fetching assignment', error);
            }
        };
        fetchData();
    }, [assId, userData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5173/api/assignment/submit/',
                { ass_id: assId, submitted_url: studentSubmission} ,
                {withCredentials: true }
            );
            alert('Assignment submitted successfully');
        } catch (error) {
            console.error("Error while submitting:", error);
        }
    };

    const submitMarks = async (studentId) => {
        try {
            await axios.post('http://localhost:5173/api/assignment/submitMarks/',
                { ass_id: assId, user: studentId, marks: parseInt(marksMap[studentId]) },
                { withCredentials: true }
            );
            alert("Marks updated");
        } catch (error) {
            console.error("Error while assigning marks:", error);
        }
    };

    return (
        <div className="assignmentClass">
            <Navbar />
            <div style={{ padding: "2rem" }}>
                {assignment && (
                    <>
                        <h1>{assignment.name}</h1>
                        <p><strong>Instructions:</strong> {assignment.instructions}</p>
                        <p><strong>Due:</strong> {new Date(assignment.dueDate).toLocaleString()}</p>
                        <a href={assignment.descriptionUrl} target="_blank" rel="noopener noreferrer">Assignment Description</a>
                    </>
                )}

                {userData && userData.isStudent ? (
                    <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
                        <label>Submission URL:</label><br />
                        <input
                            type="url"
                            value={studentSubmission}
                            onChange={(e) => setStudentSubmission(e.target.value)}
                            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
                            required
                        />
                        <button type="submit">Submit Assignment</button>
                        {studentMarks !== null && (
                            <p>Your Marks: {studentMarks} / {assignment?.total_Marks}</p>
                        )}
                    </form>
                ) : (
                    <div style={{ marginTop: "2rem" }}>
                        <h2>All Students</h2>
                        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Submission</th>
                                    <th>Marks</th>
                                    <th>Assign Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((sub) => (
                                    <tr key={sub.student_id}>
                                        <td>{sub.name}</td>
                                        <td>{sub.submitted ? "Submitted" : "Not Submitted"}</td>
                                        <td>
                                            {sub.submitted ? (
                                                <a href={sub.submitted_url} target="_blank" rel="noreferrer">View</a>
                                            ) : "-"}
                                        </td>
                                        <td>{sub.marks !== null ? sub.marks : "-"}</td>
                                        <td>
                                            {sub.submitted && (
                                                <>
                                                    <input
                                                        type="number"
                                                        placeholder="Enter Marks"
                                                        value={marksMap[sub.student_id] || ""}
                                                        onChange={(e) => setMarksMap({
                                                            ...marksMap,
                                                            [sub.student_id]: e.target.value
                                                        })}
                                                    />
                                                    <button onClick={() => submitMarks(sub.student_id)}>Submit</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>

    );
};

export default AssignmentPage;
