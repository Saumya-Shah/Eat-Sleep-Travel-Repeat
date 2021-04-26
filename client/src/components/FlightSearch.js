import React from "react";
import FlightSearchRow_NONSTOP from "./FlightSearchRow";
import FlightSearchRow_ONESTOP from "./FlightSearchRow";
import "../style/FlightSearch.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default class FlightSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sourceCity: "",
      destCity: "",
      stops: [],
      selectstop:"0",
      routes:[]
    };

    this.handlesourceCitysearch = this.handlesourceCitysearch.bind(this);
    this.handledestCitysearch = this.handledestCitysearch.bind(this);
    this.handlestopsselect = this.handlestopsselect.bind(this);
    this.submitall = this.submitall.bind(this);
  }


  componentDidMount(){
    let stopDivs = [0,1,2].map((stop,i) =>(
      <option className="stopChoice" value={stop}>
          {stop}
      </option>
    ));
    this.setState(
      {
        stops: stopDivs
      }
    );
  };

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
  handlestopsselect(e){
    this.setState({
      selectstop: e.target.value
    });
  }
	
  submitall(){
    console.log(this.state.selectstop);
    fetch(
      "http://localhost:8082/FlightSearch/" + this.state.sourceCity + "/" + this.state.destCity + "/" + this.state.selectstop,
      {
        method: "GET"
      })
        .then(res => res.json())
        .then(selectroute =>{
          console.log("[submitall]: returned result from server:", selectroute);
          var routeDivs;
          if(this.state.selectstop == 0){
            routeDivs = selectroute.map((routeObj,i) =>(
              <FlightSearchRow_NONSTOP
                source_airport = {routeObj.SOURCE_AIRPORT}
                dest_airport={routeObj.DEST_AIRPORT}
                time={routeObj.TIME}
                airlineid={routeObj.AIRLINEID}
              />
            ));
          }else if (this.state.selectstop == 1){
            console.log("[FlightSearch.js]: one stop case!");
            routeDivs = selectroute.map((routeObj,i) =>(
              <FlightSearchRow_ONESTOP
                source_airport = {routeObj.SOURCE_AIRPORT}
                mid_airport = {routeObj.MID_AIRPORT}
                dest_airport={routeObj.DEST_AIRPORT}
                time={routeObj.TIME}
                airlineid_1={routeObj.AIRLINEID_1}
                airlineid_2={routeObj.AIRLINEID_2}
              />
            ));
          }else{//TODO: change to twostop case here
            routeDivs = selectroute.map((routeObj,i) =>(
              <FlightSearchRow_NONSTOP
                source_airport = {routeObj.SOURCE_AIRPORT}
                dest_airport={routeObj.DEST_AIRPORT}
                time={routeObj.TIME}
                airlineid={routeObj.AIRLINEID}
              />
            ));
          }
          this.setState(
            {
              routes: routeDivs
            }
          )
        })
        .catch(err => console.log(err))
      };

  render() {
    if(this.state.selectstop == 0){
      return (
        <div className="FlightSearch">
          <div className="container flightsearch-container">
            <div className="jumbotron">
              <div className="h5">Flight Search</div>
              <br></br>
              <div className="dropdown-container">Stops:{"\t"}
                  <select value={this.state.selectstop} onChange={this.handlestopsselect} 
                  className="dropdown" id="stopsDropdown">
                      {this.state.stops}
                  </select>
              </div>
              <div className="input-container">
                  <input
                  type="text"
                  placeholder="Enter sourceCity Name"
                  value={this.state.sourceCity}
                  onChange={this.handlesourceCitysearch}
                  id="sourceCityName"
                  className="sourceCity-input"
                  />
                  <input
                  type="text"
                  placeholder="Enter destCity Name"
                  value={this.state.destCity}
                  onChange={this.handledestCitysearch}
                  id="destCityName"
                  className="destCity-input"
                  />
                  <button className="submit-btn" id="submitBtn" onClick={this.submitall}>Submit</button>
              </div>
            </div>
            <div className="jumbotron">
              <div className="header-container">
                <div className="h6">Available Airlines</div>
                <div className="headers">
                  <div className="header">
                    <strong>Source Airport</strong>
                  </div>  
                  <div className="header">
                    <strong>Destination Airport</strong>
                  </div> 
                  <div className="header">
                    <strong>Time(h)</strong>
                  </div>  
                  <div className="header">
                    <strong>Airline ID</strong>
                  </div>          
                </div>
              </div>
              <div className="results-container" id="results">
                {this.state.routes}
              </div>
              
            </div>
          </div>
        </div>
      );
    }else if(this.state.selectstop == 1){
      return (
        <div className="FlightSearch">
          <div className="container flightsearch-container">
            <div className="jumbotron">
              <div className="h5">Flight Search</div>
              <br></br>
              <div className="dropdown-container">Stops:{"\t"}
                  <select value={this.state.selectstop} onChange={this.handlestopsselect} 
                  className="dropdown" id="stopsDropdown">
                      {this.state.stops}
                  </select>
              </div>
              <div className="input-container">
                  <input
                  type="text"
                  placeholder="Enter sourceCity Name"
                  value={this.state.sourceCity}
                  onChange={this.handlesourceCitysearch}
                  id="sourceCityName"
                  className="sourceCity-input"
                  />
                  <input
                  type="text"
                  placeholder="Enter destCity Name"
                  value={this.state.destCity}
                  onChange={this.handledestCitysearch}
                  id="destCityName"
                  className="destCity-input"
                  />
                  <button className="submit-btn" id="submitBtn" onClick={this.submitall}>Submit</button>
              </div>
            </div>
            <div className="jumbotron">
              <div className="header-container">
                <div className="h6">Available Airlines</div>
                <div className="headers">
                  <div className="header">
                    <strong>Source Airport</strong>
                  </div>
                  <div className="header">
                    <strong>Transit Airport</strong>
                  </div>  
                  <div className="header">
                    <strong>Destination Airport</strong>
                  </div> 
                  <div className="header">
                    <strong>Total Time(h)</strong>
                  </div>  
                  <div className="header">
                    <strong>First Airline ID</strong>
                  </div>  
                  <div className="header">
                    <strong>Second Airline ID</strong>
                  </div>          
                </div>
              </div>
              <div className="results-container" id="results">
                {this.state.routes}
              </div>  
            </div>
          </div>
        </div>
      );
    }else{
      return (
        <div className="FlightSearch">
          <div className="container flightsearch-container">
            <div className="jumbotron">
              <div className="h5">Flight Search</div>
              <br></br>
              <div className="dropdown-container">Stops:{"\t"}
                  <select value={this.state.selectstop} onChange={this.handlestopsselect} 
                  className="dropdown" id="stopsDropdown">
                      {this.state.stops}
                  </select>
              </div>
              <div className="input-container">
                  <input
                  type="text"
                  placeholder="Enter sourceCity Name"
                  value={this.state.sourceCity}
                  onChange={this.handlesourceCitysearch}
                  id="sourceCityName"
                  className="sourceCity-input"
                  />
                  <input
                  type="text"
                  placeholder="Enter destCity Name"
                  value={this.state.destCity}
                  onChange={this.handledestCitysearch}
                  id="destCityName"
                  className="destCity-input"
                  />
                  <button className="submit-btn" id="submitBtn" onClick={this.submitall}>Submit</button>
              </div>
            </div>
            <div className="jumbotron">
              <div className="header-container">
                <div className="h6">Available Airlines</div>
                <div className="headers">
                  <div className="header">
                    <strong>Source Airport</strong>
                  </div>  
                  <div className="header">
                    <strong>Destination Airport</strong>
                  </div> 
                  <div className="header">
                    <strong>Time(h)</strong>
                  </div>  
                  <div className="header">
                    <strong>Airline ID</strong>
                  </div>          
                </div>
              </div>
              <div className="results-container" id="results">
                {this.state.routes}
              </div>
              
            </div>
          </div>
        </div>
      );
    }
    
  };
};
