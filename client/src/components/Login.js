import React from "react";
import PageNavbar from "./PageNavbar";
import "../style/Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import Axios from "axios";

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usernameReg: "",
      passwordReg: "",
      firstnameReg: "",
      lastnameReg: "",
    };

    this.submitRegistration = this.submitRegistration.bind(this);
  }

  submitRegistration() {
    console.log("Submit registration called");
  }
  //   Axios.post("http://localhost:8082/register", {
  //     username: this.state.usernameReg,
  //     password: this.state.passwordReg,
  //     firstname: this.state.firstnameReg,
  //     lastname: this.state.lastnameReg,
  //   }).then((response) => {
  //     console.log(response);
  //   });
  // }

  render() {
    return (
      <div className="Login">
        <PageNavbar active="login" />
        <div className="registration">
          <h1>Registration</h1>
          <label>First Name</label>
          <input
            type="text"
            onChange={(e) => {
              this.setState({ firstnameReg: e.target.value });
            }}
          ></input>
          <label>Last Name</label>
          <input
            type="text"
            onChange={(e) => {
              this.setState({ lastnameReg: e.target.value });
            }}
          ></input>
          <label>User Name</label>
          <input
            type="text"
            onChange={(e) => {
              this.setState({ usernameReg: e.target.value });
            }}
          ></input>
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => {
              this.setState({ passwordReg: e.target.value });
            }}
          ></input>
          <button
            id="registerBtn"
            className="register-btn"
            onClick={this.submitRegistration}
          >
            Submit
          </button>
        </div>
        <div className="login">
          <h1>Login</h1>
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button>Login</button>
        </div>
      </div>
    );
  }
}
