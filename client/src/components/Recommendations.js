import React from "react";
import RecommendationsRow from "./RecommendationsRow";
import "../style/Recommendations.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Recommendations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurantName: "",
      recrestaurants: [],
    };

    this.handlerestaurantNameChange = this.handlerestaurantNameChange.bind(
      this
    );
    this.submitrestaurant = this.submitrestaurant.bind(this);
  }

  handlerestaurantNameChange(e) {
    this.setState({
      restaurantName: e.target.value,
    });
  }

  submitrestaurant() {
    fetch(
      "http://localhost:8082/recommendations/" + this.state.restaurantName,
      {
        method: "GET", // The type of HTTP request.
      }
    )
      .then(
        (res) => {
          // Convert the response data to a JSON.
          console.log("in client");
          console.log(res);
          return res.json();
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      )
      .then(
        (restaurantList) => {
          if (!restaurantList) return;
          // Map each keyword in this.state.keywords to an HTML element:
          // A button which triggers the showrestaurants function for each keyword.
          console.log(restaurantList);

          const RecommendationsRowDivs = restaurantList.map(
            (restaurantObj, i) => (
              <RecommendationsRow
                name={restaurantObj.NAME}
                address={restaurantObj.ADDRESS}
                city={restaurantObj.CITY}
                state={restaurantObj.STATE}
              />
            )
          );

          // Set the state of the keywords list to the value returned by the HTTP response from the server.
          this.setState({
            recrestaurants: RecommendationsRowDivs,
          });
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      );
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
