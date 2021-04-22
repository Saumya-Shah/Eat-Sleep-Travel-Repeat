import React from "react";
import "../style/Personals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from "axios";
import RecommendationsRow from "./RecommendationsRow";

export default class Personals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visitedRestaurants: [],
      favRestaurants: <h5>"You have no favorite restaurants!"</h5>,
    };
    this.onChangeValue_res_place = this.onChangeValue_res_place.bind(this);
  }
  onChangeValue_res_place(event) {
    console.log(event.target.value);
  }
  componentDidMount() {
    Axios.get("http://localhost:8082/get_favs")
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
            favRestaurants: <h5>"You have no favorite restaurants!"</h5>,
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
          this.setState({ favRestaurants: RecommendationsRowDivs });
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
            <h2>Favorite restaurants:</h2>
            {this.state.favRestaurants}
          </div>
        </div>
      </div>
    );
  }
}
