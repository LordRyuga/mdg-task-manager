import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";

const localizer = momentLocalizer(moment);

const AssignmentCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get("/api/auth/users/get_user_assignments", {
          withCredentials: true, // ✅ send cookies along with the request
        });

        const formatted = response.data.map((a) => ({
          id: a.ass_id,
          title: `${a.name} (${a.class_name})`,
          start: new Date(a.dueDate),
          end: new Date(a.dueDate),
        }));

        setEvents(formatted);
      } catch (error) {
        console.error("Failed to fetch assignments:", error);
      }
    };

    fetchAssignments();
  }, []);

  const handleSelectEvent = (event) => {
    window.location.href = `/assignments/${event.id}`;
  };

  return (
    <div className="h-screen p-4">
      <Calendar
        localizer={localizer}
        events={events}
        views={["week"]}
        defaultView="week"
        startAccessor="start"
        endAccessor="end"
        style={{ height: "80vh" }}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default AssignmentCalendar;
