import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register() {

    const { user } = useContext(UserContext);
    const [fullName, setFullname] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [isActive, setIsActive] = useState(false);

    useEffect(() => {

        if (email !== "" && password !== "" && fullName !== "") {
            setIsActive(true)
        } else {
            setIsActive(false)
        }


    }, [email, password, fullName])


    function registerUser(e) {

        e.preventDefault();

        fetch('http://localhost:4000/users/register', {

            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                fullName: fullName,
                email: email,
                password: password

            })
        })
            .then(res => res.json())
            .then(data => {

                //determine the returned data. Especially useful when the given API is online.
                console.log(data);

                //data will only contain an email property if we can properly save our user.
                if (data.message === "Registered Successfully") {

                    setEmail('');
                    setPassword('');
                    fullName('');

                    Swal.fire({
                        title: "Registration Successful",
                        icon: "success",
                        text: "Thank you for registering!"
                    });

                }

            })
    }


    return (

        <Form onSubmit={(e) => registerUser(e)}>
            <h1 className="my-5 text-center">Register</h1>
            <Form.Group>
                <Form.Label>FullName:</Form.Label>
                <Form.Control
                    type="fullName"
                    placeholder="Enter FullName"
                    required
                    value={fullName}
                    onChange={e => { setFullname(e.target.value) }} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter Email"
                    required
                    value={email}
                    onChange={e => { setEmail(e.target.value) }} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    required
                    value={password}
                    onChange={e => { setPassword(e.target.value) }} />
            </Form.Group>

            {
                isActive

                    ? <Button variant="primary" type="submit">Submit</Button>
                    : <Button variant="primary" disabled>Submit</Button>
            }
        </Form>

    )
}