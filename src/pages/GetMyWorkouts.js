import React, { useEffect, useState, useContext } from 'react';
import { ListGroup, Card, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import { Link } from 'react-router-dom';

export default function GetWorkouts() {
    const { user } = useContext(UserContext);
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://localhost:4000/workouts/getMyWorkouts', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.workouts) {
                    setWorkouts(data.workouts);
                } else {
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: data.error || 'Failed to fetch workouts.'
                    });
                }
            })
            .catch(err => {
                console.error('Error fetching workouts:', err);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Failed to fetch workouts.'
                });
            });
    }, [user]);

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');

        fetch(`http://localhost:4000/workouts/deleteWorkout/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    Swal.fire({
                        title: 'Deleted',
                        icon: 'success',
                        text: data.message
                    });
                    setWorkouts(workouts.filter(workout => workout._id !== id));
                } else {
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: data.error || 'Failed to delete workout.'
                    });
                }
            })
            .catch(err => {
                console.error('Error deleting workout:', err);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Failed to delete workout.'
                });
            });
    };

    const handleToggleStatus = (id, currentStatus) => {
        const token = localStorage.getItem('token');
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';

        fetch(`http://localhost:4000/workouts/completeWorkoutStatus/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => res.json())
            .then(data => {
                if (data._id) {
                    Swal.fire({
                        title: 'Success',
                        icon: 'success',
                        text: 'Workout status updated successfully.'
                    });
                    // Update the state to reflect the new status
                    setWorkouts(workouts.map(workout =>
                        workout._id === id ? { ...workout, status: newStatus } : workout
                    ));
                } else {
                    Swal.fire({
                        title: 'Error',
                        icon: 'error',
                        text: data.error || 'Failed to update workout status.'
                    });
                }
            })
            .catch(err => {
                console.error('Error updating workout status:', err);
                Swal.fire({
                    title: 'Error',
                    icon: 'error',
                    text: 'Failed to update workout status.'
                });
            });
    };

    return (
        <div>
            <h2>Your Workouts</h2>
            {workouts.map(workout => (
                <Card key={workout._id} className="mb-3">
                    <Card.Body>
                        <Card.Title>{workout.name}</Card.Title>
                        <Card.Text>
                            Duration: {workout.duration} <br />
                            Status: {workout.status}
                        </Card.Text>
                        {/* Use Link to navigate to the UpdateWorkout page */}
                        <Button as={Link}
                            to={`/updateWorkout/${workout._id}`}
                            className="btn btn-primary me-2"
                        >
                            Update
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => handleDelete(workout._id)}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handleToggleStatus(workout._id, workout.status)}
                        >
                            {workout.status === 'pending' ? 'Mark as Completed' : 'Mark as Pending'}
                        </Button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
}
