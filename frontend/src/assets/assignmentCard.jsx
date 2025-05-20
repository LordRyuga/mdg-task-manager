import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function AssignmentCard({ ass_id, name, description, total_Marks, dueDate }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/assignment/${ass_id}`);
    };

    return (
        <Card sx={{ minWidth: 275, m: 2 }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                    Assignment
                </Typography>
                <Typography variant="h5" component="div">
                    {name}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                    Total Marks: {total_Marks}
                </Typography>
                <Typography variant="body2">
                    {description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Due: {new Date(dueDate).toLocaleString()}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handleClick}>View Assignment</Button>
            </CardActions>
        </Card>
    );
}
