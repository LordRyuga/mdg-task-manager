import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BasicCard({ name, description, class_id }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/classroom/${class_id}`);
    };

    const handleLeaveClass = async () => {
        try {
            await axios.post(
                `/api/classrooms/leave/`,
                { class_id },
                { withCredentials: true }
            );
            alert("You left the classroom");
            
        } catch (error) {
            console.error("Failed to leave the classroom", error);
            alert("Failed to leave  classroom.");
        }
    };

    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                    Classroom
                </Typography>
                <Typography variant="h5" component="div">
                    {name}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                    Class ID: {class_id}
                </Typography>
                <Typography variant="body2">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleClick}>
                    Open Class
                </Button>
                <Button size="small" color="error" onClick={handleLeaveClass}>
                    Leave Class
                </Button>
            </CardActions>
        </Card>
    );
}
