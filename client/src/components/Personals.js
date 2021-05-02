import React from "react";
import "../style/Personals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from "axios";
import RecommendationsRow from "./RecommendationsRow";
// import { RadioGroup, RadioButton } from "react-radio-buttons";
import Dropdown from 'react-bootstrap/Dropdown'

export default class Personals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favRestaurants: <h5>"You have no favorite restaurants!"</h5>,
      visitedRestaurants: <h5>"You have no visited restaurants!"</h5>,
      favCities: <h5>"You have no favorite cities!"</h5>,
      visitedCities: <h5>"You have no visited cities!"</h5>,
      displayFields: <h5>"You have no visited cities!"</h5>,
      mode: "fav_restaurants",
      button_text : "Favorite Restaurants",
      is_active: 1,
    };
    this.onChangeValue_mode = this.onChangeValue_mode.bind(this);
    this.update_display = this.update_display.bind(this);
  }

  update_display() {
    var url;
    console.log(this.state.mode)
    if (
      this.state.mode === "fav_restaurants" 
    ) {
      this.setState({button_text: "Favorite Restaurants", is_active: 1});
      url = "http://localhost:8082/get_fav_res";
      this.get_restaurants(url);
    } 
    else if(this.state.mode === "visited_restaurants"){
      this.setState({button_text: "Visited Restaurants", is_active: 2});
      url = "http://localhost:8082/get_visi_res";
      console.log("going to:",url);
      this.get_restaurants(url);
    }
    else {
      if (this.state.mode==="fav_places"){this.setState({button_text: "Favorite Places", is_active: 3,});}
      if (this.state.mode==="visited_places"){this.setState({button_text: "Visited Places", is_active: 4})}
      this.setState({
        displayFields: <h5>"Application not yet ready for this!"</h5>,
      });
    }
  }
  async onChangeValue_mode(event) {
    await this.setState({ mode: event });
    this.update_display();
  }



  get_restaurants(url) {
    Axios.get(url)
      .then(
        (response) => {
          console.log(response.data);
          return response.data;
        },
        (err) => {
          console.log(err);
        }
      )
      .then((restaurantList) => {
        console.log(restaurantList);
        if (restaurantList.length === 0) {
          this.setState({
            displayFields: <h5>"You have no saved restaurants!"</h5>,
          });
        } else {
          const RecommendationsRowDivs = restaurantList.map(
            (restaurantObj, i) => (
              <RecommendationsRow
                name={restaurantObj.NAME}
                address={restaurantObj.ADDRESS}
                city={restaurantObj.CITY}
                state={restaurantObj.STATE}
                stars={restaurantObj.STARS}
                reviews={restaurantObj.REVIEW_COUNT}
              />
            )
          );
          this.setState({ displayFields: RecommendationsRowDivs });
        }
      });
  }
  componentDidMount(){
    // const temp = document.getElementById("defaultButton");
    // temp.click();
    this.update_display();
  }

  render() {
    return (
      <div className="Recommendations">
        <div className="container recommendations-container">
          <div className="jumbotron jumbotron-custom">
            <div className="h3">My Gems</div>
            <br></br>
            <Dropdown >
              <Dropdown.Toggle variant="success" id="dropdown-basic" className="dropdown_color">
                {this.state.button_text}
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdown_color">
                <Dropdown.Item eventKey="fav_restaurants"onSelect={this.onChangeValue_mode} active={this.state.is_active===1}>Favorite Restaurants</Dropdown.Item>
                <Dropdown.Item eventKey="visited_restaurants" onSelect={this.onChangeValue_mode} active={this.state.is_active===2}>Visited Restaurants</Dropdown.Item>
                <Dropdown.Item eventKey="fav_places" onSelect={this.onChangeValue_mode} active={this.state.is_active===3}>Favorite Places</Dropdown.Item>
                <Dropdown.Item eventKey="visited_places" onSelect={this.onChangeValue_mode} active={this.state.is_active===4}>Visited Places</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

           
            <br></br>
            <br></br>

            {this.state.displayFields}
          </div>
        </div>
      </div>
    );
  }
}
