import React, { useState } from 'react';
import { TextField, Button } from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSubmit =(event) => {

    try {
      axios.post("https://image1-w5u6k6uuza-uc.a.run.app/create", {
        name,
        email,
        password,
        location
      }).then(
            navigate('/login')
        );
    } catch (error) {
      console.error(error);
    }
  };

  return (   
    <div style={{height: "750px", width: "550px"}}>
      <form
        autoComplete="off"
        style={{width: "550px", height: "650px", position: "relative", backgroundColor: "white", marginTop: "30px",  marginLeft: "0px"}}
        onSubmit={(event) => handleSubmit(event)}
      >
        <h2 style={{paddingTop: "40px"}}>Signup Form</h2>
        <h4 style={{ marginTop: "20px", marginLeft: "-360px" }}>Name</h4>
        <TextField
          label="Name"
          required
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ mb: 3 }}
          style={{width: "400px"}}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <h4 style={{ marginTop: "20px", marginLeft: "-360px" }}>Email</h4>
        <TextField
          label="Email"
          required
          variant="outlined"
          color="secondary"
          type="text"
          sx={{ mb: 3 }}
          style={{width: "400px"}}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <h4 style={{ marginTop: "20px", marginLeft: "-320px" }}>Password</h4>
        <TextField
          label="Password"
          required
          variant="outlined"
          color="secondary"
          type="password"
          sx={{ mb: 3 }}
          style={{width: "400px"}}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <h4 style={{ marginTop: "20px", marginLeft: "-330px" }}>Location</h4>
        <TextField
          label="Location"
          required
          variant="outlined"
          color="secondary"
          type="text"
          style={{width: "400px"}}
          sx={{ mb: 3 }}
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
        <Button variant="outlined" style={{ backgroundColor: "#0b5ed7", position: "absolute", top: "580px", left: "40%", color: 'white' }} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Signup;
