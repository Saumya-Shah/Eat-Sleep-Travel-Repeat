import React from "react";
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
      loggedIn: false,
    };

    this.submitRegistration = this.submitRegistration.bind(this);
    this.render_login_page = this.render_login_page.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  submitRegistration() {
    console.log("Submit registration called");
    Axios.post("http://localhost:8082/register", {
      username: this.state.usernameReg,
      password: this.state.passwordReg,
      firstname: this.state.firstnameReg,
      lastname: this.state.lastnameReg,
    }).then((response) => {
      // console.log(response);
    });
  }

  submitLogin() {
    // console.log("Submit login called");
    Axios.post("http://localhost:8082/login", {
      username: this.state.usernameLog,
      password: this.state.passwordLog,
    }).then((response) => {
      // console.log(response);
      if (response.data.message) {
        this.setState({ loginStatus: response.data.message });
      } else {
        this.setState({
          loginStatus: "Hello " + response.data[0].FIRST_NAME,
          loggedIn: true,
        });
      }
    });
  }

  handleLogout() {
    console.log("Logging out");
    Axios.get("http://localhost:8082/logout").then((response) => {
      this.setState({ loggedIn: false });
    });
  }

  componentDidMount() {
    Axios.get("http://localhost:8082/login").then((response) => {
      // console.log(response.data);
      if (response.data.loggedIn)
        this.setState({
          loginStatus: "Hello " + response.data.user.FIRST_NAME,
          loggedIn: true,
        });
      else {
        this.setState({ loggedIn: false });
      }
    });
  }

  render_login_page() {
    if (this.state.loggedIn === true) {
      console.log("Logged In");
      return (
        <div className="registration">
          <h1> {this.state.loginStatus + ", welcome! "}</h1>
          <button
            id="registerBtn"
            className="button2"
            onClick={this.handleLogout}
          >
            Logout
          </button>
        </div>
      );
    } else {
      // console.log("Not logged in, trying to render");
      return (
        <div>
          {" "}
          <div className="registration">
            <h2>Register</h2>
            <label className="label">First Name </label>
            <input
              className="defaultTextBox"
              type="text"
              onChange={(e) => {
                this.setState({ firstnameReg: e.target.value });
              }}
            ></input>
            <label className="label">Last Name</label>
            <input
              className="defaultTextBox"
              type="text"
              onChange={(e) => {
                this.setState({ lastnameReg: e.target.value });
              }}
            ></input>
            <label className="label">User Name</label>
            <input
              className="defaultTextBox"
              type="text"
              onChange={(e) => {
                this.setState({ usernameReg: e.target.value });
              }}
            ></input>
            <label className="label">Password</label>
            <input
              className="defaultTextBox"
              type="password"
              onChange={(e) => {
                this.setState({ passwordReg: e.target.value });
              }}
            ></input>
            <button
              id="registerBtn"
              className="button2"
              onClick={this.submitRegistration}
            >
              Register
            </button>
          </div>
          <br />
          <br />
          <div className="login">
            <h3>
              {" "}
              Already have an account? <br />
              Login
            </h3>
            <input
              className="defaultTextBox"
              type="text"
              placeholder="User Name"
              onChange={(e) => {
                this.setState({ usernameLog: e.target.value });
              }}
            ></input>
            <input
              className="defaultTextBox"
              type="password"
              placeholder="Password"
              onChange={(e) => {
                this.setState({ passwordLog: e.target.value });
              }}
            ></input>
            <button
              className="button2"
              id="registerBtn"
              onClick={this.submitLogin}
            >
              Login
            </button>
          </div>{" "}
        </div>
      );
    }
  }

  render() {
    return (
      <div className="Login">
        {this.render_login_page()}
        <h2>{this.state.loggedIn}</h2>
      </div>
    );
  }
}
