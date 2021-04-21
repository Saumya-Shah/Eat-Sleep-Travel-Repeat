import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box, Flex, Image } from "rebass";
import StarRatings from "react-star-ratings";

export default class RecommendationsRow extends React.Component {
  /* ---- Q2 (Recommendations) ---- */
  render() {
    return (
      <div className="restaurantResults">
        <Flex className="custom-flex" alignItems="center">
          <Box width={1 / 3}>
            <Image src="https://loremflickr.com/150/150/bar?random=1" />
          </Box>
          <Box width={2 / 3} ml="auto">
            <h5>{this.props.name}</h5>
            <p>
              {this.props.address} , {this.props.city}, {this.props.state}
            </p>
            <StarRatings
              rating={3}
              starRatedColor="ffffff"
              numberOfStars={5}
              name="rating"
              starDimension="20px"
              starSpacing="1px"
            ></StarRatings>
            <p> 10 reviews</p>
          </Box>
        </Flex>
      </div>
    );
  }
}
