import React from "react";
import PageNavbar from "./PageNavbar";
import "../style/Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from "axios";

Axios.defaults.withCredentials = true;
export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usernameReg: "",
      passwordReg: "",
      firstnameReg: "",
      lastnameReg: "",
      usernameLog: "",
      passwordLog: "",
      loginStatus: "",
    };

    this.submitRegistration = this.submitRegistration.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

  submitRegistration() {
    console.log("Submit registration called");
    Axios.post("http://localhost:8082/register", {
      username: this.state.usernameReg,
      password: this.state.passwordReg,
      firstname: this.state.firstnameReg,
      lastname: this.state.lastnameReg,
    }).then((response) => {
      console.log(response);
    });
  }

  submitLogin() {
    console.log("Submit login called");
    Axios.post("http://localhost:8082/login", {
      username: this.state.usernameLog,
      password: this.state.passwordLog,
    }).then((response) => {
      console.log(response);
      if (response.data.message) {
        this.setState({ loginStatus: response.data.message });
      } else {
        this.setState({ loginStatus: "Hello " + response.data[0].FIRST_NAME });
      }
    });
  }

  componentDidMount() {
    Axios.get("http://localhost:8082/login").then((response) => {
      console.log(response.data);
      if (response.data.loggedIn)
        this.setState({
          loginStatus: "Hello " + response.data.user.FIRST_NAME,
        });
    });
  }

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
            Register
          </button>
        </div>
        <div className="login">
          <h1>Login</h1>
          <input
            type="text"
            placeholder="User Name"
            onChange={(e) => {
              this.setState({ usernameLog: e.target.value });
            }}
          ></input>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              this.setState({ passwordLog: e.target.value });
            }}
          ></input>
          <button
            id="registerBtn"
            className="register-btn"
            onClick={this.submitLogin}
          >
            Login
          </button>
        </div>
        <h2>{this.state.loginStatus}</h2>
      </div>
    );
  }
}
