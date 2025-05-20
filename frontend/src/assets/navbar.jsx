import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ColoredLine from './coloredLine';
import Hamburger from 'hamburger-react';
import Avatar from '@mui/material/Avatar';
import { Navigate, useNavigate } from 'react-router-dom';


const Navbar = () => {

  const navigate = useNavigate();

  const [classrooms, setClassrooms] = useState([]);
  const [isOpen, setOpen] = useState(true);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get('/api/classrooms/getAllClassrooms/');
        // console.log(response.data);
        setClassrooms(response.data);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
      }
    };

    fetchClassrooms();
  }, []);


  return (
    <div className="navbar">
      <div style={{ position: 'fixed', top: '1em', left: 0, height: '100vh', zIndex: 100, width: '15rem', marginTop: '0' }}>
        <div style={{ marginLeft: '95%', marginTop: '0.25em', zIndex: 100, position: 'fixed' }} onClick={() => { navigate('/profile') }}>
          <Avatar />
        </div>
        <div className='HaburgerIcon' style={{ marginLeft: '1em', marginTop: '0em', marginBottom: '0.5em', zIndex: 10, position: 'fixed' }}>
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
        <div className="coloredLine" style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', zIndex: 5, marginTop: '-1rem' }}>
          <ColoredLine color="#1e1e2f" />
        </div>
        <Sidebar backgroundColor="#1e1e2f" rootStyles={{ height: '100%', width: '100%', marginTop: '4rem', zIndex: 10}} collapsedWidth="0" collapsed={!isOpen}>
          <Menu
            menuItemStyles={{
              button: ({ level }) => {
                if (level === 0) {
                  return {
                    color: '#fff',
                    backgroundColor: '#1e1e2f',
                    '&:hover': {
                      backgroundColor: '#3e3e55',
                    },
                  };
                }
                if (level === 1) {
                  return {
                    color: '#ddd',
                    backgroundColor: '#2c2c40',
                    '&:hover': {
                      backgroundColor: '#3a3a55',
                      color: '#fff',
                    },
                  };
                }
              },
            }}
          >
            <SubMenu label="Get started" defaultOpen>
              <MenuItem
                component={<Link to="/login" />}
              >
                Login
              </MenuItem>
              <MenuItem
                component={<Link to="/register" />}
              >
                Sign up
              </MenuItem>
            </SubMenu>
            <MenuItem>Calendar</MenuItem>
            <MenuItem
              component={<Link to="/profile" />}
            >
              Profile
            </MenuItem>
            <MenuItem
              component={<Link to="/home" />}
            >
              Home
            </MenuItem>
            <SubMenu label="Classrooms">
              {classrooms.map(classroom => (
                <MenuItem
                  key={classroom.class_id}
                  component={<Link to={`/classroom/${classroom.class_id}`} />}
                >
                  {classroom.name}
                </MenuItem>
              ))}
            </SubMenu>

          </Menu>
        </Sidebar>
      </div>
    </div>
  );
};

export default Navbar;
