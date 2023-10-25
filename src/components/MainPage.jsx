import React from 'react';
import { Link } from 'react-router-dom';



function MainPage() {
  
    return (
      <div className="wrapper">
      <div className="cenetr-container">
        <h1 className="greeting-header">Hello</h1>
        <div className="button-container">
            <Link to="/register" className="registerLink">Sign up</Link>
            <Link to="/login" className="loginLink">Login</Link>
        </div>
        </div>
      </div>
    );
  }
  
export default MainPage;