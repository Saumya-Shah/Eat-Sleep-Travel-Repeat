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
      stops: [],
      selectstop:"",
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
          console.log(this.state.destCity,this.state.sourceCity);
          console.log(selectroute);
          
          let routeDivs = selectroute.map((routeObj,i) =>(
            <FlightSearchRow
              sourceCity = {routeObj.SOURCECITY}
              destCity={routeObj.DESTCITY}
              time={routeObj.TIME}
              airlineid={routeObj.AIRLINEID}
            />
          ));

          this.setState(
            {
              routes: routeDivs
            }
          )
          console.log("Routes:",this.state.routes);
        })
        .catch(err => console.log(err))
      };






  render() {
    return (
      <div className="FlightSearch">
        <PageNavbar active="FlightSearch" />

        <div className="container flightsearch-container">
          <div className="jumbotron">
            <div className="h5">FlightSearch</div>
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
              <div className="h6">Your plan ...</div>
              <div className="headers">
                <div className="header">
                  <strong>sourceCity</strong>
                </div>  
                <div className="header">
                  <strong>destCity</strong>
                </div> 
                <div className="header">
                  <strong>Time</strong>
                </div>  
                <div className="header">
                  <strong>airlineid</strong>
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
  };
};
