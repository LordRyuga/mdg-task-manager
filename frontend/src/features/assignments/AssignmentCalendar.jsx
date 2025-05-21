import { Scheduler } from "@aldabil/react-scheduler";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../assets/navbar";
import { useUser } from "../profile/userContext";
import { Link } from "react-router-dom";

const AssignmentCalendar = () => {

  const { userData } = useUser();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("/api/auth/users/get_user_assignments", {
          withCredentials: true,
        });

        console.log(response.data);

        const formatted = response.data.map((a) => ({
          event_id: a.ass_id,
          title: `${a.name} (${a.class_name})`,
          start: new Date(a.dueDate),
          end: new Date(a.dueDate),
          editable: false,
          deletable: false
        }));

        console.log(formatted);

        setEvents(formatted);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      }
    };

    fetchAssignments();
  }, [userData]);


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
    <div className="AssignmentCalendar" style={{ marginLeft: 'auto', marginTop: '5rem' }}>
      <Navbar />
      <Scheduler
        view="month" // default view
        events={events}
        day={{
          startHour: 0,
          endHour: 24,
          step: 60,         // Optional: controls time slot size (e.g., 60 minutes)
          navigation: true  // Optional: enables date navigation
        }}
        week={{
          startHour: 0,
          endHour: 24,
          step: 60,
          navigation: true
        }}
        hourFormat="24"      // Optional: shows 24-hour time format instead of AM/PM
      />
    </div>
  )
}


export default AssignmentCalendar