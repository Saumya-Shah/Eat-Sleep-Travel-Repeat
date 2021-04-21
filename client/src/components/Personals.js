import React from "react";
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

  render() {
    return (
      <div className="Recommendations">
        <div className="container recommendations-container">
          <div className="jumbotron jumbotron-custom">
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
              <button
                id="submitrestaurantBtn"
                className="submit-btn"
                onClick={this.submitrestaurant}
              >
                Submit
              </button>
            </div>
            <div className="header-container">
              <div className="h6">You may like ...</div>
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
