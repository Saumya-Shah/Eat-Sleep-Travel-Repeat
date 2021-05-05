import React from "react";
import RecommendationsRow from "./RecommendationsRow";
import "../style/Recommendations.css";
import "../style/stars.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from "axios";
import DropDownCity from "./ResCityDropdown";
import DropDownCrusine from "./ResCrusineDropdown";

export default class Recommendations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurantCityName: "Las Vegas",
      restaurantStateName: "NV",
      crusine: [],
      recrestaurants: [],
      Latitude: 0,
      Longitude: 0,
      time_start: "",
      time_end: "23:59",
      flag: 1,
      day: "",
      star: 1,
      currentLoc: "",
      currentState: "",
      citiesDropdown: "",
      crusineDropdown:"",
    
    };
    // this.componentDidMount = this.componentDidMount(this);
    this.onCityInputChange = this.onCityInputChange.bind(this);
    this.onCrusineInputChange=this.onCrusineInputChange.bind(this);    
    this.submitrestaurant = this.submitrestaurant.bind(this);
    this.handletimestartChange = this.handletimestartChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }


  onCityInputChange(e,{value}){
    console.log("changedddd",this);
    if (value==="Current Location"){
      this.setState({restaurantCityName: value});
    }
    else{
    this.setState({
      restaurantCityName: value.substring(0,value.length-4),
      restaurantStateName: value.substring(value.length-2),
    });}
  }


 async onCrusineInputChange(e,{value}){
    console.log("changedddd crusine",this);
    console.log("changedddd crusine value",value);
    await this.setState({crusine: value});
    console.log("changedddd crusine value state",this.state.crusine);

    // if (value==="Current Location"){
    //   this.setState({restaurantCityName: value});
    // }
    // else{
    // this.setState({
    //   restaurantCityName: value.substring(0,value.length-4),
    //   restaurantStateName: value.substring(value.length-2),
    // });}
  }



  // onChange(e) {
  //   const options = this.state.crusine;
  //   let index;
  //   if (e.target.checked) {
  //     options.push(e.target.value);
  //   } else {
  //     index = options.indexOf(e.target.value);
  //     options.splice(index, 1);
  //   }
  //   this.setState({ crusine: options });
  //   // console.log(this.state.crusine);
  // }

  componentDidMount() {
    const success = (position) => {
      this.setState(
        {
          Latitude: position.coords.latitude,
          Longitude: position.coords.longitude,
        },
        () => {
          this.getUpdate();
        }
      );
    };
    this.setState({citiesDropdown: <DropDownCity onInputChange={this.onCityInputChange}></DropDownCity>})
    this.setState({crusineDropdown: <DropDownCrusine onInputCrusineChange={this.onCrusineInputChange} ></DropDownCrusine>})

    console.log("crusineDropdown:->",this.state.crusineDropdown);

    function error() {
      console.log("Unable to retrieve your location");
    }

    navigator.geolocation.getCurrentPosition(success, error);
  }

  getUpdate() {
    console.log("this.state.Latitude", this.state.Latitude);
    console.log("this.state.Longitude", this.state.Longitude);

    let date = new Date();
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    let time_now = hours + ":" + minutes;
    console.log("time_now", time_now);

    var days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var day = days[date.getDay()];

    const url = new URL("http://localhost:8082/recommendations/");
    Axios.post(url, {
      lat: this.state.Latitude,
      lon: this.state.Longitude,
      cru: this.state.crusine,
      city: this.state.restaurantCityName,
      state: this.state.restaurantStateName,
      ts: time_now,
      te: this.state.time_end,
      day: day,
      flag: 1,
      star: this.state.star,
    })
      .then(
        (res) => {
          // Convert the response data to a JSON.
          return res.data;
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      )
      .then(
        (restaurantList) => {
          if (!restaurantList) return;
          console.log("restaurantList", restaurantList);
          // Map each keyword in this.state.keywords to an HTML element:
          // A button which triggers the showrestaurants function for each keyword.
          const RecommendationsRowDivs = restaurantList.map(
            (restaurantObj, i) => (
              <RecommendationsRow
                business_id={restaurantObj.BUSINESS_ID}
                name={restaurantObj.NAME}
                address={restaurantObj.ADDRESS}
                city={restaurantObj.CITY}
                state={restaurantObj.STATE}
                stars={restaurantObj.STARS}
                reviews={restaurantObj.REVIEW_COUNT}
                flag2={11}
                pic={restaurantObj.PHOTO_ID}

              />
            )
          );

          // Set the state of the keywords list to the value returned by the HTTP response from the server.

          this.setState({
            recrestaurants: RecommendationsRowDivs,
            restaurantCityName: restaurantList[0].CITY,
            restaurantStateName: restaurantList[0].STATE,
            currentLoc: restaurantList[0].CITY,
            currentState: restaurantList[0].STATE,
            day: day,
            time_start: time_now,
          });
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      );
  }

  

  handletimestartChange(e) {
    this.setState({
      time_start: e.target.value,
    });

    console.log("this.state.time_start", this.state.time_start);
  }

  handleRadioChange(event) {
    let s = parseInt(event.target.value);
    console.log(" s iss", s);
    this.setState({
      star: s,
    });
  }

  async submitrestaurant() {
    const url = new URL("http://localhost:8082/recommendations/");
    if (this.state.restaurantCityName==="Current Location"){
      await this.setState({restaurantCityName: this.state.currentLoc, restaurantStateName: this.state.currentState});
    }
    Axios.post(url, {
      lat: this.state.Latitude,
      lon: this.state.Longitude,
      cru: this.state.crusine,
      city: this.state.restaurantCityName,
      state: this.state.restaurantStateName,
      ts: this.state.time_start,
      te: this.state.time_end,
      day: this.state.day,
      star: this.state.star,
      flag: 0,
    })
      .then(
        (res) => {
          // Convert the response data to a JSON.
          return res.data;
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      )
      .then(
        (restaurantList) => {
          if (!restaurantList) return;
          // Map each keyword in this.state.keywords to an HTML element:
          // A button which triggers the showrestaurants function for each keyword.
          // console.log(restaurantList);

          const RecommendationsRowDivs = restaurantList.map(
            (restaurantObj, i) => (
              <RecommendationsRow
                business_id={restaurantObj.BUSINESS_ID}
                name={restaurantObj.NAME}
                address={restaurantObj.ADDRESS}
                city={restaurantObj.CITY}
                state={restaurantObj.STATE}
                stars={restaurantObj.STARS}
                reviews={restaurantObj.REVIEW_COUNT}
                flag2={11}
                pic={restaurantObj.PHOTO_ID}

              />
            )
          );

          // Set the state of the keywords list to the value returned by the HTTP response from the server.
          this.setState({
            recrestaurants: RecommendationsRowDivs,
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
      <div className="Recommendations">
        <div className="container recommendations-container">
          <div className="jumbotron jumbotron-custom">
            <div className="h5">Restaurant Recommendations</div>
            <br></br>
            <div className="input-container">
              
                <input
                type="text"
                placeholder="Enter start time"
                value={this.state.time_start}
                onChange={this.handletimestartChange}
                id="starttime"
                className="restaurant-input"
              />

              <br></br>
              <fieldset>
                <legend>Choose your Crusine</legend>
                {this.state.crusineDropdown}
                {/* <div>
                  <label>Italian</label>
                  <input
                    type="checkbox"
                    value="ITALIAN"
                    onChange={this.onChange.bind(this)}
                  />
                </div>
                <div>
                  <label>Indian</label>
                  <input
                    type="checkbox"
                    value="INDIAN"
                    onChange={this.onChange.bind(this)}
                  />
                </div>
                <div>
                  <label>Chinese</label>
                  <input
                    type="checkbox"
                    value="CHINESE"
                    onChange={this.onChange.bind(this)}
                  />
                </div> */}
              </fieldset>
              <div class="txt-center">
                <form>
                  <div class="rating">
                    <input
                      id="star5"
                      name="star"
                      type="radio"
                      value="5"
                      class="radio-btn hide"
                      checked={this.state.star.toString() === "5"}
                      onChange={this.handleRadioChange}
                    />
                    <label for="star5">☆</label>
                    <input
                      id="star4"
                      name="star"
                      type="radio"
                      value="4"
                      class="radio-btn hide"
                      checked={this.state.star.toString() === "4"}
                      onChange={this.handleRadioChange}
                    />
                    <label for="star4">☆</label>
                    <input
                      id="star3"
                      name="star"
                      type="radio"
                      value="3"
                      class="radio-btn hide"
                      checked={this.state.star.toString() === "3"}
                      onChange={this.handleRadioChange}
                    />
                    <label for="star3">☆</label>
                    <input
                      id="star2"
                      name="star"
                      type="radio"
                      value="2"
                      class="radio-btn hide"
                      checked={this.state.star.toString() === "2"}
                      onChange={this.handleRadioChange}
                    />
                    <label for="star2">☆</label>
                    <input
                      id="star1"
                      name="star"
                      type="radio"
                      value="1"
                      class="radio-btn hide"
                      checked={this.state.star.toString() === "1"}
                      onChange={this.handleRadioChange}
                    />
                    <label for="star1">☆</label>
                    <div class="clear"></div>
                  </div>
                </form>
              </div>
              {this.state.citiesDropdown}
              <button
                id="submitrestaurantBtn"
                className="submit-btn"
                onClick={this.submitrestaurant}
              >
                
                Submit
              </button>
            </div>
            <div className="header-container">
              <div className="h6">You may like ...</div>
            </div>
            <div>{this.state.recrestaurants}</div>
          </div>
        </div>
      </div>
    );
  }
}
