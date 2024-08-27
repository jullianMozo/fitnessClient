import React, { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import { useParams, Link } from 'react-router-dom';

export default function UpdateWorkout() {
    const { id } = useParams(); // Retrieve the workout ID from the URL
    const { user } = useContext(UserContext);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const [status, setStatus] = useState('pending');

    useEffect(() => {
        // Fetch the existing workout details
        const token = localStorage.getItem('token');

        fetch('http://localhost:4000/workouts/getMyWorkouts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                const workout = data.workouts.find(workout => workout._id === id);
                if (workout) {
                    setName(workout.name);
                    setDuration(workout.duration);
                    setStatus(workout.status);
                } else {
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: 'Workout not found.'
                    });
                }
            })
            .catch(err => {
                console.error('Error fetching workout details:', err);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Failed to fetch workout details.'
                });
            });
    }, [id]);

    const handleUpdate = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        fetch(`http://localhost:4000/workouts/updateWorkout/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, duration, status })
        })
            .then(res => res.json())
            .then(data => {
                if (data.workout) {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: 'Workout updated successfully.'
                    });
                    // Use Link to navigate back to the workouts page
                } else {
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: data.error || 'Failed to update workout.'
                    });
                }
            })
            .catch(err => {
                console.error('Error updating workout:', err);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Failed to update workout.'
                });
            });
    };

    return (
        <div>
            <h2>Update Workout</h2>
            <Form onSubmit={handleUpdate}>
                <Form.Group controlId="workoutName">
                    <Form.Label>Workout Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter workout name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="workoutDuration">
                    <Form.Label>Workout Duration</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter workout duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="me-2">
                    Update Workout
                </Button>

                {/* Use Link to navigate back to the GetWorkouts page */}
                <Link to="/getMyworkouts" className="btn btn-secondary">
                    Cancel
                </Link>
            </Form>
        </div>
    );
}
