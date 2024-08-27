import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AppNavbar from './components/AppNavBar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { Container } from 'react-bootstrap';
import { UserProvider } from './UserContext';
import AddWorkout from './pages/AddWorkout';
import GetWorkouts from './pages/GetMyWorkouts';
import UpdateWorkout from './pages/UpdateWorkout';


function App() {

  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  })

  useEffect(() => {

    fetch('http://localhost:4000/users/details', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)

        if (typeof data.user !== "undefined") {

          setUser({
            id: data.user._id,
            isAdmin: data.user.isAdmin
          });

        } else {

          setUser({
            id: null,
            isAdmin: null
          });

        }

      })

  }, []);

  const unsetUser = () => {

    localStorage.clear();

  };

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <Router>
        <AppNavbar />
        <Container>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='/addWorkout' element={<AddWorkout />} />
            <Route path='/getMyWorkOuts' element={<GetWorkouts />} />
            <Route path='/updateWorkout/:id' element={<UpdateWorkout />} />
          </Routes>
        </Container>
      </Router>
    </UserProvider>
  )

}

export default App;
