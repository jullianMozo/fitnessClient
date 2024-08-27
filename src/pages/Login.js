import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(false); // Initialize as false

    useEffect(() => {
        // Check if both email and password are provided
        if (email !== "" && password !== "") {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    function authenticate(e) {
        e.preventDefault(); // Prevents page redirection via form submission

        fetch('http://localhost:4000/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) { // Check if token is received
                    localStorage.setItem('token', data.token); // Use data.token instead of data.access
                    retrieveUserDetails(data.token); // Use data.token instead of data.access

                    Swal.fire({
                        title: "Login Successful",
                        icon: "success",
                        text: "Welcome to Inventory!"
                    });

                    setEmail('');
                    setPassword('');
                } else {
                    Swal.fire({
                        title: "Login Failed",
                        icon: "error",
                        text: "Invalid email or password."
                    });
                }
            })
            .catch(err => {
                console.error("Error during login:", err);
                Swal.fire({
                    title: "Login Error",
                    icon: "error",
                    text: "Something went wrong during login."
                });
            });
    }

    const retrieveUserDetails = (token) => {
        fetch('http://localhost:4000/users/details', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data._id) { // Assuming data contains user directly with _id
                    setUser({
                        id: data._id, // Use data._id directly
                        isAdmin: data.isAdmin
                    });
                } else {
                    console.error("User data is not in the expected format", data);
                    Swal.fire({
                        title: "Error",
                        icon: "error",
                        text: "Failed to retrieve user details."
                    });
                }
            })
            .catch(err => {
                console.error("Error fetching user details:", err);
                Swal.fire({
                    title: "Error",
                    icon: "error",
                    text: "Failed to retrieve user details."
                });
            });
    };

    /*     // If user is logged in, navigate to a protected route (optional)
        if (user.id) {
            return <Navigate to="/dashboard" />;
        } */

    return (
        <Form onSubmit={authenticate}>
            <h1 className="my-5 text-center">Login</h1>
            <Form.Group controlId="userEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>

            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>

            <Button
                variant="primary"
                type="submit"
                id="submitBtn"
                disabled={!isActive}
            >
                Submit
            </Button>
        </Form>
    );
}
