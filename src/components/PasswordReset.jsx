import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class PasswordReset extends Component {

    constructor(props) {
      super (props)
      this.state = {
        email:""
      };

      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
      e.preventDefault();
      const { email } = this.state;
      fetch("http://localhost:4000/forgotpassword", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          "Accept":"application/json",
          "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({
          email,
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "changingPassword");
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Check email.");
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
            <input type="email" onChange={e=>this.setState({email:e.target.value})} name="email" placeholder="email" required />
            <button type="submit" id="reset-password">Reset password</button>
        </form>
      </div>
    );
  }
}
  
export default PasswordReset;