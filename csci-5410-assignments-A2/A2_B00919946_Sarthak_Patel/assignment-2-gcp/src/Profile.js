import { Button } from '@mui/material';
import React, { useEffect, useState, componentWillUnmount } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';


function Profile() {
  const {state} = useLocation();
  const { email } = state;
  const { name } = state;
  //const [ email, setEmail ] = useState();
  //const [ name, setName ] = useState();
  const [ userData, setUserData ] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  console.log(userData)

  useEffect(()=> {    
        axios.get("https://image3-w5u6k6uuza-uc.a.run.app/online-users").then(response => {
            console.log(response);
            setOnlineUsers(response.data.onlineUsers);
        }).catch(error => {
            console.log(error)
        });
      }, []);

      window.addEventListener("unload", (event) => {
        axios.post("https://image3-w5u6k6uuza-uc.a.run.app/logout", { email }).then(response => {
            console.log(response);
            localStorage.removeItem("userData")
            navigate("/login")
        }).catch(error => {
            console.log(error)
        })
    });

 

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const handleLogout = ()=> {
    axios.post("https://image3-w5u6k6uuza-uc.a.run.app/logout", { email }).then(response => {
        console.log(response);
        localStorage.removeItem("userData")
        navigate("/login")
    }).catch(error => {
        console.log(error)
    })
  }

  return (
    <div style={{height: "750px", width: "550px"}}>
         <div style={{width: "850px", height: "650px", position: "relative", backgroundColor: "white", marginTop: "80px",  marginLeft: "-150px"}}>
            <h2 style={{paddingTop: "30px", color: "#1434A4"}}>Hi, {name} you are logged in.</h2>
            <h4 style={{paddingTop: "20px",marginLeft: "-360px"}}><i>Here are other users who are online</i></h4>
            <TableContainer style={{paddingTop: "20px"}} component={Paper}>
                <Table sx={{ maxWidth: 650, marginLeft: "12%" }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell align="right">Email</StyledTableCell>
                        <StyledTableCell align="right">Location</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {onlineUsers.map((row) => (
                        (row.name !== name) && <StyledTableRow key={row.email}>
                        <StyledTableCell component="th" scope="row">
                            {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">{row.email}</StyledTableCell>
                        <StyledTableCell align="right">{row.location}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button variant="contained" style={{marginTop: "35px"}} onClick={handleLogout}>
                Logout
            </Button>
        </div>
    </div>
  )
}

export default Profile
