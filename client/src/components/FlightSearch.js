import React from "react";
import { InputGroup, DropdownButton, FormControl, Dropdown, Button} from 'react-bootstrap';
import FlightSearchRow_NONSTOP from "./FlightSearchRow";
import FlightSearchRow_ONESTOP from "./FlightSearchRow";
import FlightSearchRow_TWOSTOP from "./FlightSearchRow";
import "../style/FlightSearch.css";
import "bootstrap/dist/css/bootstrap.min.css";
import picture from "../style/flight.jpg";
import {View, Image, StyleSheet} from "react-native";

export default class FlightSearch extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      sourceCity: "",
      destCity: "",
      selectstop:"Select Stop",
      routes:[]
    };

    this.handlesourceCitysearch = this.handlesourceCitysearch.bind(this);
    this.handledestCitysearch = this.handledestCitysearch.bind(this);
    this.handleNonStop = this.handleNonStop.bind(this);
    this.handleOneStop = this.handleOneStop.bind(this);
    this.handleTwoStop = this.handleTwoStop.bind(this);
    this.submitall = this.submitall.bind(this);
  }

  componentDidMount(){
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
  handleNonStop(){
    this.setState({
      selectstop: 0
    });
  }
  handleOneStop(){
    this.setState({
      selectstop: 1
    });
  }
  handleTwoStop(){
    this.setState({
      selectstop: 2
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
          if(this.state.selectstop == 0){// nonstop
            routeDivs = selectroute.map((routeObj,i) =>(
              <FlightSearchRow_NONSTOP
                source_airport = {routeObj.SOURCE_AIRPORT}
                dest_airport={routeObj.DEST_AIRPORT}
                time={routeObj.TIME}
                airlineid={routeObj.AIRLINEID}
                
              />
            ));
          }else if (this.state.selectstop == 1){// one stop
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
          }else{// two stop
            routeDivs = selectroute.map((routeObj,i) =>(
              <FlightSearchRow_TWOSTOP
                source_airport = {routeObj.SOURCE_AIRPORT}
                mid_airport_1 = {routeObj.MID_AIRPORT_1}
                mid_airport_2 = {routeObj.MID_AIRPORT_2}
                dest_airport={routeObj.DEST_AIRPORT}
                time={routeObj.TIME}
                airlineid_1={routeObj.AIRLINEID_1}
                airlineid_2={routeObj.AIRLINEID_2}
                airlineid_3={routeObj.AIRLINEID_3}
              />
            ));
            console.log(routeDivs);
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
    return (
      <div className="FlightSearch">
          <div className="flight_photo">
            <img src={picture} height="200" width="300"  alt="BigCo Inc. logo"/>
          </div>
        <div className="container flightsearch-container">
          <div className="jumbotron">
            <h1 className="text-center">Flight Search</h1>
            <br></br>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <DropdownButton id="dropdown-basic-button" title={this.state.selectstop}>
                  <Dropdown.Item as="button">
                    <div onClick={this.handleNonStop}>0</div>
                  </Dropdown.Item>
                  <Dropdown.Item as="button">
                    <div onClick={this.handleOneStop}>1</div>
                  </Dropdown.Item>
                  <Dropdown.Item as="button">
                    <div onClick={this.handleTwoStop}>2</div>
                  </Dropdown.Item>
                </DropdownButton>
              </InputGroup.Prepend>
              <FormControl
                placeholder="Where from?"
                aria-label="sourceCity"
                aria-describedby="basic-addon2"
                value={this.state.sourceCity}
                onChange={this.handlesourceCitysearch}
              />
              <FormControl
                placeholder="Where to?"
                aria-label="destCity"
                aria-describedby="basic-addon2"
                value={this.state.destCity}
                onChange={this.handledestCitysearch}
              />
            </InputGroup>
            <Button bsStyle="primary" size="lg" onClick={this.submitall} block>Find Recommended Flights!</Button>
          </div>
          <div className="jumbotron">
            <div className="results-container-flight" id="results">
              {this.state.routes}
            </div>
            
          </div>
        </div>
      </div>
    );    
  }
}
