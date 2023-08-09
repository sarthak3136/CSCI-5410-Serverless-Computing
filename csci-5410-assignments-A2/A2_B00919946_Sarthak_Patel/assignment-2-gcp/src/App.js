import './App.css';
import Signup from './Signup';
import Login from './Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Profile from './Profile';
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('userData'));
    setUser(storedUser);
  }, []);

  return (
    <Router>
      <div className="App" style={{ backgroundColor: "#DADADA" }}>
      <Navbar />
        <Routes>
          <Route exact path="/" element={<Signup />} />
          <Route exact path="/login" element={<Login user={user} />} />
          <Route exact path="/profile" element={<Profile user={user}/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
