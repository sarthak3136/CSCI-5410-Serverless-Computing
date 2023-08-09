import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

class Navbar extends Component{
    render(){
        return (
            <nav className='navbar bg-primary'>
              <h1>
                  Assignment 2
              </h1>
              <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/login'>Login</Link>
                </li>
              </ul>
            </nav>
          )
    }
}

export default Navbar

