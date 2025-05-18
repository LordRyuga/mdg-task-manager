import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';




const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [classrooms, setClassrooms] = useState([]);
  
    useEffect(() => {
        const fetchClassrooms = async () => {
          try {
              const response = await axios.get('/api/classrooms/getAllClassrooms/');
              setClassrooms(response.data);
          } catch (error) {
              console.error('Error fetching classrooms:', error);
          }
        };
        fetchClassrooms();
    }, []);
  
  return (
    <div className="navbar">
      <button onClick={() => setIsOpen(!isOpen)}>☰</button>
      {isOpen && (
        <div className="sidebar">
          <Link to="/Home">Home</Link>

          <div className="enrolled-classrooms">
            <p>Enrolled Classrooms:</p>
            <ul>
              {classrooms.map(classroom => (
                <li key={classroom.class_id}>
                  <Link to={`/classroom/${classroom.class_id}`}>{classroom.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <Link to="/profile">Profile</Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
