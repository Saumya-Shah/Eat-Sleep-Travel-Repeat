import React from "react";
import { Card, CardGroup, Button} from 'react-bootstrap';
import "../style/Cityaroundme.css";
import Axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Cityaroundme extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Latitude: 0,
      Longitude: 0,
      city: [],
    };

  }
  componentDidMount() {
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
          // Map each keyword in this.state.keywords to an HTML element:
          // A button which triggers the showrestaurants function for each keyword.
          console.log(CityList);
          const CityRowDivs = CityList.map(
            (CityObj, i) => (
              <Card className="card_item" key={i}>
                <Card.Body>
                  <Card.Title className="shopTitle">{CityObj.CITY}, {CityObj.COUNTRY}</Card.Title>
                  <Card.Text>distance: {CityObj.DISTANCE}km</Card.Text>
                  <Button variant="primary" >Détails</Button>
                </Card.Body>
              </Card>
            )
          );
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
          <h1 className="text-center">Nearby Cities</h1>
            <br></br>
            <CardGroup className="card_container">{this.state.city}</CardGroup>            
          </div>
        </div>
      </div>
    );
  }
}
