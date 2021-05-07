import React from "react";
import "../style/Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from "axios";
import { View, Text } from "react-native";
import { withWidth } from "@material-ui/core";

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
    Axios.post("https://localhost:8082/register", {
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
    Axios.post("https://localhost:8082/login", {
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
    Axios.get("https://localhost:8082/logout").then((response) => {
      this.setState({ loggedIn: false, loginStatus: "" });
    });
  }

  componentDidMount() {
    Axios.get("https://localhost:8082/login").then((response) => {
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
        <div className="registration" >
          <h1> {this.state.loginStatus + ", welcome! "}</h1>
          <h1>{"Let's Eat-Sleep-Travel-Repeat! "}</h1>
          <View style={{
              alignItems: 'center',
              justifyContent: 'center', 
              // backgroundColor: 'white',
              
              text: 'white',
              width: '66%',               
          }}>
          <Text style={{ color: 'black', fontSize: 20, lineHeight: 30,textAlign: 'justify', }}>{"People have been trapped at home due to COVID-19 for a long time and the trend to travel after the quarantine/covid-19 ends will be quite popular. Based on the passion and demand to travel and enjoy delicious food, our team has decided to implement this web application that helps you find restaurants/places based on your favorites, geolocation, personal habit and word-of-mouth rating. The project is to design a web application based on two dataset: Yelp restaurant dataset and Airlines within the United states. We intend to deliver a convenient way for users to choose and plan where to go and what to eat. "}</Text>
          </View>
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
          <div className="login" style={{height: '100%'}}>
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
          <p>{this.state.loginStatus}</p>
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
