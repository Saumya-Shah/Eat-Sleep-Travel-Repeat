import React from "react";
import PageNavbar from "./PageNavbar";
import "../style/Personals.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Personals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visitedRestaurants: [],
      favRestaurants: [],
    };
  }

  handlerestaurantNameChange(e) {
    this.setState({
      restaurantName: e.target.value,
    });
  }

  render() {
    return (
      <div className="Personals">
        {/* <PageNavbar active="personals" /> */}
        <div className="container recommendations-container">
          <div className="jumbotron">
            <div className="h5">Restaurant Recommendations</div>
            <br></br>
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter restaurant Name"
                value={this.state.restaurantName}
                onChange={this.handlerestaurantNameChange}
                id="restaurantName"
                className="restaurant-input"
              />
              <button id="submitrestaurantBtn" className="submit-btn">
                Submit
              </button>
            </div>
            <div className="header-container">
              <div className="h6">You may like ...</div>
              <div className="headers">
                <div className="header">
                  <strong>Name</strong>
                </div>
                <div className="header">
                  <strong>Address</strong>
                </div>
                <div className="header">
                  <strong>City</strong>
                </div>
                <div className="header">
                  <strong>State</strong>
                </div>
              </div>
            </div>
            <div className="results-container" id="results">
              {this.state.recrestaurants}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
