import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Login extends Component {
    constructor(props) {
      super(props)
      this.state= {
        email: "",
        password: ""
      };
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
      e.preventDefault();
      const { email, password } = this.state;
      fetch("http://localhost:4000/login", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          "Accept":"application/json",
          "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({
          email,
          password
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if(data.status === "ok") {
          toast.success("You are logged in");
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);
          setTimeout(() => {
            window.location.href = "./app";
          }, 2000);
        } else if (data.error) {
          toast.error(data.error);
        }
      });
    }

    render() {
      return (
      <div className="wrapper">
        <h1 className="login-header">Hello</h1>
        <ToastContainer />
        <form onSubmit={this.handleSubmit}>
            <input type="email" onChange={(e) => this.setState({ email: e.target.value })} name="email" placeholder="email" required />
            <input type="password" onChange={(e) => this.setState({ password: e.target.value })} name="password" placeholder="password" required />
            <button type="submit" id="login">Login</button>
            <Link to="/forgotpassword" className="forgotPasswordLink">Forgot password?</Link>
        </form> 
      </div>
    );
  }
}
  

export default Login;