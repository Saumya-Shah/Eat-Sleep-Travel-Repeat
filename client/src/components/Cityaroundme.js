import React from "react";
import { Card, CardGroup, Button, Container, Row, Col,} from 'react-bootstrap';
import "../style/Cityaroundme.css";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import * as GiIcon from "react-icons/gi";
import * as FaIcon from "react-icons/fa";

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
      trips:[],
      routes: [],
    };
    this.submitUsr = this.submitUsr.bind(this);

  }
  componentDidMount() {
    /* show popular city */
    let url = "http://localhost:8082/popularCity/";
    Axios.get(url)
      .then((res) => {
          console.log(res);
          return res.data;
        },
        (err) => {
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
    /* show recommended trips */
    url = "http://localhost:8082/trip/";
    Axios.get(url)
      .then((res) => {
          console.log(res);
          return res.data;
        },
        (err) => {
          console.log(err);
        }
      )
      .then((res) => {
        const tripDivs = res.map(
          (tripObj, i) => (
            <CardGroup>
              <Card className="card_item">
                <Card.Header>First Stop</Card.Header>
                <Card.Body>
                  <Row className="justify-content-md-center">
                    <Col md="auto"> <FaIcon.FaCity/></Col>
                    <Col>{tripObj.CITY1}</Col>
                    <Col md="auto"> <FaIcon.FaPizzaSlice/></Col>
                    <Col>{tripObj.REST1}</Col>
                    <Col md="auto"> <FaIcon.FaMapMarkerAlt/></Col>
                    <Col>{tripObj.ADD1}</Col>
                    <Col md="auto"> <FaIcon.FaRegStar/></Col>
                    <Col md="auto">{tripObj.STAR1}</Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card className="card_item">
                <Card.Header>Second Stop</Card.Header>
                <Card.Body>
                  <Row className="justify-content-md-center">
                    <Col md="auto"> <FaIcon.FaCity/></Col>
                    <Col>{tripObj.CITY2}</Col>
                    <Col md="auto"> <FaIcon.FaPizzaSlice/></Col>
                    <Col>{tripObj.REST2}</Col>
                    <Col md="auto"> <FaIcon.FaMapMarkerAlt/></Col>
                    <Col>{tripObj.ADD2}</Col>
                    <Col md="auto"> <FaIcon.FaRegStar/></Col>
                    <Col>{tripObj.STAR2}</Col>
                  </Row>
                </Card.Body>
              </Card>
              <Card className="card_item">
                <Card.Header>Third Stop</Card.Header>
                <Card.Body>
                  <Row className="justify-content-md-center">
                    <Col md="auto"> <FaIcon.FaCity/></Col>
                    <Col>{tripObj.CITY3}</Col>
                    <Col md="auto"> <FaIcon.FaPizzaSlice/></Col>
                    <Col>{tripObj.REST3}</Col>
                    <Col md="auto"> <FaIcon.FaMapMarkerAlt/></Col>
                    <Col>{tripObj.ADD3}</Col>
                    <Col md="auto"> <FaIcon.FaRegStar/></Col>
                    <Col>{tripObj.STAR3}</Col>
                  </Row>
                </Card.Body>
              </Card>
            </CardGroup>
          )
        );
        this.setState({trips: tripDivs});
      })
      .catch(error => console.log(error));
    /* show nearby city */
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
            <br></br>      
          </div>
        </div>
        <div class="jumbotron jumbotron-fluid">
          <h1 className="text-center">Recommended Trips</h1>
          <Container fluid={true}>{this.state.trips}</Container>   
        </div>
      </div>  
    );
  }
}
