import React from "react";
import "../style/Personals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from "axios";
import RecommendationsRow from "./RecommendationsRow";
import { RadioGroup, RadioButton } from "react-radio-buttons";
import { GiTrophiesShelf } from "react-icons/gi";

export default class Personals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visitedRestaurants: [],
      favRestaurants: <h5>"You have no favorite restaurants!"</h5>,
      visitedRestaurants: <h5>"You have no visited restaurants!"</h5>,
      favCities: <h5>"You have no favorite cities!"</h5>,
      visitedCities: <h5>"You have no visited cities!"</h5>,
      displayFields: <h5>"You have no visited cities!"</h5>,
      res_place: "restaurant",
      fav_visited: "favorite",
    };
    this.onChangeValue_res_place = this.onChangeValue_res_place.bind(this);
    this.onChangeValue_fav_visited = this.onChangeValue_res_place.bind(this);
    this.update_display = this.update_display.bind(this);
  }

  update_display() {
    console.log(this.state.res_place, this.state.fav_visited);
    if (
      this.state.res_place === "restaurant" &&
      this.state.fav_visited === "favorite"
    ) {
      const url = "http://localhost:8082/get_fav_res";
      this.get_restaurants(url);
    } else {
      this.setState({
        displayFields: <h5>"Application not yet ready for this!"</h5>,
      });
    }
  }
  onChangeValue_res_place(event) {
    this.setState({ res_place: event });
    this.update_display();
  }

  onChangeValue_fav_visited(event) {
    this.setState({ fav_visited: event });
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
        if (restaurantList.length === 0) {
          this.setState({
            displayFields: <h5>"You have no favorite restaurants!"</h5>,
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

  render() {
    return (
      <div className="Recommendations">
        <div className="container recommendations-container">
          <div className="jumbotron jumbotron-custom">
            <div className="h3">My Gems</div>
            <br></br>
            <RadioGroup
              onChange={this.onChangeValue_res_place}
              horizontal
              value="restaurant"
              className="radio_buttons"
            >
              <RadioButton value="restaurant">Restaurants</RadioButton>
              <RadioButton value="place">Places</RadioButton>
            </RadioGroup>
            <br></br>

            <RadioGroup
              onChange={this.onChangeValue_fav_visited}
              horizontal
              iconInnerSize="10px"
              value="favorite"
              className="radio_buttons"
            >
              <RadioButton value="favorite">Favorites</RadioButton>
              <RadioButton value="visited">Visited</RadioButton>
            </RadioGroup>
            <br></br>
            <br></br>

            {this.state.displayFields}
          </div>
        </div>
      </div>
    );
  }
}
