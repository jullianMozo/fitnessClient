import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {

    return (
        <>
            <Row>
                <Col className="p-4 text-center">
                    <h1>Welcome To our Fitness tracking App</h1>
                    <p>Create, Update, Delete and View Gain in Training</p>
                    <Link className="btn btn-primary" to={'/getMyWorkOuts'}>Check youre progress</Link>
                </Col>
            </Row>
        </>
    )
}