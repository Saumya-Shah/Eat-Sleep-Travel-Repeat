import React from "react";
import CityaroundmeRow from "./CityaroundmeRow";
import "../style/Cityaroundme.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Cityaroundme extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cityName: "",
      city: [],
    };

    this.handleCitysearch = this.handleCitysearch.bind(
      this
    );
    this.submitCity = this.submitCity.bind(this);
  }

  handleCitysearch(e) {
    this.setState({
      cityName: e.target.value,
    });
  }

  submitCity() {
    fetch(
      "http://localhost:8082/cityaroundme/" + this.state.cityName,
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
        (CityList) => {
          if (!CityList) return;
          // Map each keyword in this.state.keywords to an HTML element:
          // A button which triggers the showrestaurants function for each keyword.
          console.log("here!");
          console.log(CityList);

          const CityRowDivs = CityList.map(
            (CityObj, i) => (
              <CityaroundmeRow
                destination_id={CityObj.DESTINATION_ID}  
                city={CityObj.CITY}
                distance={CityObj.DISTANCE}
              />
            )
          );
          console.log(CityRowDivs);
          // Set the state of the keywords list to the value returned by the HTTP response from the server.
          this.setState({
            city: CityRowDivs,
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
      <div className="Cityaroundme">
        <div className="container cityaroundme-container">
          <div className="jumbotron">
            <div className="h5">City Aroundme</div>
            <br></br>
            <div className="input-container">
              <input
                type="text"
                placeholder="Enter City Name"
                value={this.state.cityName}
                onChange={this.handleCitysearch}
                id="cityName"
                className="city-input"
              />
              <button
                id="submitcityBtn"
                className="submit-btn"
                onClick={this.submitCity}
              >
                Submit
              </button>
            </div>
            <div className="header-container">
              <div className="h6">Where you are ...</div>
              <div className="headers">
                <div className="header">
                  <strong>Destination_ID</strong>
                </div>  
                <div className="header">
                  <strong>City</strong>
                </div> 
                <div className="header">
                  <strong>Distance</strong>
                </div>            
              </div>
            </div>
            <div className="results-container" id="results">
              {this.state.city}
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}
