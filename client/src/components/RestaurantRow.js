import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box, Flex, Image } from "rebass";

export default class RestaurantRow extends React.Component {
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
          </Box>
        </Flex>
      </div>
    );
  }
}
