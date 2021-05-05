import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Box, Flex, Image } from "rebass";
import Axios from "axios";
import Rating from "@material-ui/lab/Rating";
import HeartCheckbox from 'react-heart-checkbox';

export default class RecommendationsRow extends React.Component {
  /* ---- Q2 (Recommendations) ---- */

  constructor(props) {
    super(props);

    this.state = {
      checked:false,
    };
   this.onClick = this.onClick.bind(this);
  }

  async onClick(evnet, props) {
    console.log("this.state.checked before",this.state.checked)
    // var temp=this.state.checked;

     await this.setState({ checked: !this.state.checked});

    console.log("this.state.checked after",this.state.checked)

    const url = new URL("http://localhost:8082/recommendations/");

    console.log("this.props.flag2",this.props.flag2)
    

    if (this.props.flag2==11 && this.state.checked==true ){      
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

 
  componentDidMount() {
       if (this.props.flag2==10)  
          {this.setState({ checked: true});}
    }



  render() {
 
  
  //  var text_msg="add to favourites";
  //  if (this.props.flag2==10)  
  //     {this.setState({ checked: true});}
  //  text_msg="Remove from favourites"     
    
    return (
     
      <div className="restaurantResults">
        <Flex className="custom-flex" alignItems="center">
          <Box width={1 / 3}>
            <div className="square">
            <Image  src={"/res_pics/"+this.props.pic} />
            </div>
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

          <HeartCheckbox checked={this.state.checked} onClick={this.onClick} />
        </Flex>
        <hr class="solid" />
      </div>
    );
  }
}
