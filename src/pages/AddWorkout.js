import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function AddWorkout() {
    const { user } = useContext(UserContext);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        fetch('http://localhost:4000/workouts/addWorkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, duration })
        })
            .then(res => res.json())
            .then(data => {
                if (data._id) {
                    Swal.fire({
                        title: 'Workout Added',
                        icon: 'success',
                        text: 'Your workout has been added successfully.'
                    });
                    setName('');
                    setDuration('');
                } else {
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: data.error || 'An error occurred while adding the workout.'
                    });
                }
            })
            .catch(err => {
                console.error('Error adding workout:', err);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Failed to add workout.'
                });
            });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Add Workout</h2>
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
                <Form.Label>Duration</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter workout duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Add Workout
            </Button>
        </Form>
    );
}
