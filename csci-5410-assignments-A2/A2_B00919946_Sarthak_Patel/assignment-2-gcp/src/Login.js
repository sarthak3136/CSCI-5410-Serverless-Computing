import React, { useState } from 'react';
import { TextField, Button } from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [userData, setUserData] = useState();

const handleSubmit = (event) => {
    event.preventDefault();
  
    axios
      .post("https://image2-w5u6k6uuza-uc.a.run.app/login", {
        email,
        password
      })
      .then(response => {
        console.log(response.data);
        setMessage(message);
        if (response.data.userData.email === email) {
          console.log(email);
          console.log(response.data);
          sessionStorage.setItem('userData', JSON.stringify(response.data.userData));
          const storedUser = JSON.parse(sessionStorage.getItem('userData'));
          console.log(storedUser)
          // navigate('/profile', { state: { email: response.data.userData.email, name: response.data.userData.name } });
          navigate('/profile', {state: { email: storedUser.email, name: storedUser.name, userData: storedUser.userData}})
          //navigate("/profile")
        }
      })
      .catch(error => {
        console.log(error);
        setMessage("Error occurred during login");
      });
  };

  return (
    <div style={{height: "750px", width: "550px"}}>
      <form autoComplete="off" style={{width: "550px", height: "450px", position: "relative", backgroundColor: "white", marginTop: "80px",  marginLeft: "0px"}} onSubmit={handleSubmit}>
        <h2 style={{paddingTop: "40px"}}>Login Form</h2>
        <h4 style={{ marginTop: "20px", marginLeft: "-350px" }}>Email</h4>
        <TextField 
          label="Email"
          required
          variant="outlined"
          color="secondary"
          type="email"
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
          style={{width: "400px"}}
          sx={{ mb: 3 }}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Button variant="outlined" style={{ backgroundColor: "#0b5ed7", position: "absolute", top: "340px", left: "40%", color: 'white'}} type="submit">
          Submit
        </Button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
