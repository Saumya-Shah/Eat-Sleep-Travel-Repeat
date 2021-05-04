import React from "react";
import { Card, CardGroup, Button, Container, Row, Col,} from 'react-bootstrap';
import FlightSearchRow_NONSTOP from "./FlightSearchRow";
import {Redirect} from 'react-router-dom';
import "../style/Cityaroundme.css";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as GiIcon from "react-icons/gi";

export default class Cityaroundme extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Latitude: 0,
      Longitude: 0,
      usrCity: "",
      usrCountry: "",
      nearbyCities: [],
      popularCities:[],
      routes: [],
    };
    this.submitUsr = this.submitUsr.bind(this);

  }
  componentDidMount() {
    let url = "http://localhost:8082/popularCity/";
    Axios.get(url)
      .then((res) => {
          console.log(res);
          return res.data;
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      )
      .then((res) => {
        const popularCityDivs = res.map(
          (cityObj, i) => (
            <Card className="card_item" key={i}>
              <Card.Body>
                <Card.Title className="shopTitle">{cityObj.CITY}</Card.Title>
                <div>
                  <Button type="submit" bsStyle="primary" value={cityObj.CITY} onClick={this.submitUsr}>Go!</Button>
                </div>
              </Card.Body>
            </Card>
          )
        );
        this.setState({popularCities: popularCityDivs});
      })
      .catch(error => console.log(error));
    const success = (position) => {
      this.setState(
        {
          Latitude: position.coords.latitude,
          Longitude: position.coords.longitude,
        },
        () => {
          this.submitCity();
        }
      );
    };
    function error() {
      console.log("Unable to retrieve your location");
    }
    navigator.geolocation.getCurrentPosition(success, error);
  }
  submitUsr(e) {
    let url = "http://localhost:8082/FlightSearch/"+ this.state.usrCity + "/" + e.target.value + "/0";
    Axios.get(url)
      .then((res) => {
          // console.log(res.data);
          return res.data;
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      )
      .then((res) => {
        const routeRows = res.map(
          (routeObj, i) => ( 
            <Card className="card_item">
                <Card.Body>
            <Row className="justify-content-md-center">
              <Col md="auto"> <GiIcon.GiAirplaneDeparture /></Col>
              <Col md="auto">{routeObj.SOURCE_AIRPORT}</Col>
              <Col md="auto"> <GiIcon.GiAirplaneArrival /></Col>
              <Col md="auto">{routeObj.DEST_AIRPORT}</Col>
              <Col md="auto"> <GiIcon.GiAlarmClock /></Col>
              <Col >{routeObj.TIME}h</Col>
              <Col >airlineid:{routeObj.AIRLINEID}</Col>
            </Row>
            </Card.Body>
              </Card>
          )
        );
        this.setState({routes: routeRows});
        console.log(this.state.routes);
      })
      .catch(error => console.log(error));
  }
  submitCity() {
    const url = new URL("http://localhost:8082/cityaroundme/");
    Axios.post(url, {
      lat: this.state.Latitude,
      lon: this.state.Longitude,
    })
      .then(
        (res) => {
          console.log(res);
          return res.data;
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      )
      .then(
        (CityList) => {
          if (!CityList) return;
          this.setState({
            usrCity: CityList[0].CITY,
            usrCountry: CityList[0].COUNTRY,
          });
          CityList = CityList.splice(1, 4);
          console.log(CityList);
          const nearbyCityDivs = CityList.map(
            (CityObj, i) => (
              <Card className="card_item" key={i}>
                <Card.Body>
                  <Card.Title className="shopTitle">{CityObj.CITY}, {CityObj.COUNTRY}</Card.Title>
                  <Card.Text>distance: {CityObj.DISTANCE}km</Card.Text>
                </Card.Body>
              </Card>
            )
          );
          // Set the state of the keywords list to the value returned by the HTTP response from the server.
          this.setState({
            nearbyCities: nearbyCityDivs,
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
      <div className="city recommendation">
        <div className="container nearbyCity-container">
          <div className="jumbotron">
          <h1 className="text-center">Nearby City</h1>
            <br></br>
            <CardGroup className="card_container">{this.state.nearbyCities}</CardGroup>            
          </div>
        </div>
        <div className="container popularCity-container">
          <div className="jumbotron">
          <h1 className="text-center">Popular City</h1>
            <br></br>
            <CardGroup className="card_container">{this.state.popularCities}</CardGroup> 
            <br></br>
            {this.state.routes.length > 0 && 
              <Container>
                <h2 className="text-center">Flight Results</h2>
                {this.state.routes}
              </Container>
            }           
          </div>
          
        </div>
      </div>  
    );
  }
}
