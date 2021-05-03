import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box, Flex, Image } from "rebass";
import Axios from "axios";
import Rating from "@material-ui/lab/Rating";


export default class RecommendationsRow extends React.Component {
  /* ---- Q2 (Recommendations) ---- */

  addtofav(e) {  
        const url = new URL("http://localhost:8082/recommendations/");
    if (this.props.flag2==11){      
          Axios.post(
            url, {
            bid:this.props.business_id,       
            flag: 2
          })   
      
    }
    else{
      Axios.post(
        url, {
        bid:this.props.business_id,       
        flag: 3
      })  
      window.location.reload();
    }
  }




  render() {
   var text_msg="add to favourites";
   if (this.props.flag2==10)         
   text_msg="Remove from favourites"     
    
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
            <Rating
              value={this.props.stars}
              numberOfStars={5.0}
              name="rating"
              precision={0.5}
              readOnly
              size="small"
              max={5}
            ></Rating>
            <p> {this.props.reviews} reviews</p>

          </Box>
       
        
          <input type="button" value={text_msg} onClick={this.addtofav.bind(this)} />


        </Flex>
        <hr class="solid" />
      </div>
    );
  }
}
