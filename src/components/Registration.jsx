import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Registration extends Component {

    constructor(props) {
      super (props)
      this.state = {
        name: "",
        email:"",
        password:"",
        repeatPassword:"",
      };

      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
      e.preventDefault();
      const { name, email, password, repeatPassword } = this.state;
      fetch("http://localhost:4000/register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          "Accept":"application/json",
          "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({
          name,
          email,
          password,
          repeatPassword
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Registration successful. You can now log in.");
          setTimeout(() => {
            window.location.href = "./login";
          }, 2000);
        }
      });
    }

    render() {
      return (
      <div className="wrapper">
        <h1 className="login-header">Hello</h1>
        <ToastContainer />
        <form onSubmit={this.handleSubmit}>
            <input type="text" onChange={e=>this.setState({name:e.target.value})} name="name" placeholder="name" required />
            <input type="email" onChange={e=>this.setState({email:e.target.value})} name="email" placeholder="email" required />
            <input type="password" onChange={e=>this.setState({password:e.target.value})} name="password" placeholder="password" required />
            <input type="password" onChange={e=>this.setState({repeatPassword:e.target.value})} name="repeatPassword" placeholder="repeat password" />
            <button type="submit" id="signup">Sign up</button>
        </form>
      </div>
    );
  }
}
  
export default Registration;