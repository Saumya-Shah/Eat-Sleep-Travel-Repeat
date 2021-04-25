import React from "react";
import PageNavbar from "./PageNavbar";
import FlightSearchRow from "./FlightSearchRow";
import "../style/FlightSearch.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default class FlightSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceCity: "",
      destCity: "",
      stops: [0,1,2],
      routes:[],
    };

    this.handlesourceCitysearch = this.sourceCitysearch.bind(this);
    this.handledestCitysearch = this.handledestCitysearch.bind(this);
    this.handlestopsselect = this.handlestopsselect.bind(this);
    this.submitall = this.submitall.bind(this);
  }





  handlesourceCitysearch(e) {
		this.setState({
			sourceCity: e.target.value
		});
		
	};

  handledestCitysearch(e) {
		this.setState({
			destCity: e.target.value
		});
		
	};

  handlestopselect(){
    fetch(
      "http://localhost:8082/FlightSearch/",
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
        (resList) => {
          if (!resList) return;
          // Map each keyword in this.state.keywords to an HTML element:
          // A button which triggers the showrestaurants function for each keyword.

          // Set the state of the keywords list to the value returned by the HTTP response from the server.
          this.setState({
            sourceCity: ResRowDivs,
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
        <PageNavbar active="cityaroundme" />

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
