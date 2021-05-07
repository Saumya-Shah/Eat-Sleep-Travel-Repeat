import React  from "react";
import RecommendationsRow from "./RecommendationsRow";
import "../style/Recommendations.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Axios from "axios";
import DropDownCity from "./ResCityDropdown";
import { Button,Input,Rating,Checkbox } from 'semantic-ui-react'
import DropDownCrusine from "./ResCrusineDropdown";
import * as FaIcon from "react-icons/fa";


export default class Recommendations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurantCityName: "Las Vegas",
      restaurantStateName: "NV",
      crusine: [],
      recrestaurants: [],
      recrestaurants_selected:<h5>"No restaurant satisfy the selected criteria!"</h5>,
      recrestaurants_selected_index:0,
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
      advancefilterchoice:false,
      parking:false,
      covid:false,
      empty:false,
      page_buttons: "",
    
    };
    // this.componentDidMount = this.componentDidMount(this);
    this.advancefilter=this.advancefilter.bind(this);
    this.advancefilterdisplay=this.advancefilterdisplay.bind(this);
    this.onCityInputChange = this.onCityInputChange.bind(this);
    this.onCrusineInputChange=this.onCrusineInputChange.bind(this);    
    this.submitrestaurant = this.submitrestaurant.bind(this);
    this.handletimestartChange = this.handletimestartChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleparking=this.handleparking.bind(this);
    this.handlecovid=this.handlecovid.bind(this);
    this.decNearbyrest=this.decNearbyrest.bind(this);
    this.incNearbyrest=this.incNearbyrest.bind(this);
    this.setButtons = this.setButtons.bind(this);
  

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

    await this.setState({crusine: value});   

  }

  async handleparking(e){
    await this.setState(
      {
        parking: !this.state.parking
    
      });

      console.log("this.state.parking",this.state.parking);
  }


  
  async handlecovid(e){
    await this.setState(
      {
        covid: !this.state.covid
    
      });

      console.log("this.state.covid",this.state.covid);
  }


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

  async decNearbyrest(){
    console.log(" inside decNearbyrest");
    console.log("recrestaurants_selected_index",this.state.recrestaurants_selected_index);
    await this.setState({recrestaurants_selected_index: this.state.recrestaurants_selected_index - 5<0 ? 0 : this.state.recrestaurants_selected_index - 5});
    const RecommendationsRowDivs = this.state.recrestaurants.slice(this.state.recrestaurants_selected_index, this.state.recrestaurants_selected_index+5).map(
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


    await this.setState({
      recrestaurants_selected: RecommendationsRowDivs,
      restaurantCityName: this.state.recrestaurants[this.state.recrestaurants_selected_index].CITY,
      restaurantStateName: this.state.recrestaurants[this.state.recrestaurants_selected_index].STATE,
      currentLoc: this.state.recrestaurants[this.state.recrestaurants_selected_index].CITY,
      currentState:this.state.recrestaurants[this.state.recrestaurants_selected_index].STATE,

    });
    this.setButtons();
    

  }

  async setButtons(){
    console.log("type",this.state.recrestaurants_selected.type);
    if (this.state.recrestaurants_selected.type==="h5"){
      await this.setState({page_buttons : <p></p>});
    }
    else{
      await this.setState({page_buttons: <div> 
        <Button onClick={this.decNearbyrest}><FaIcon.FaArrowAltCircleLeft/></Button>
        <Button onClick={this.incNearbyrest}><FaIcon.FaArrowAltCircleRight/></Button>
        </div>})
     
    }
  }

  async incNearbyrest(){
  console.log(" inside incNearbyrest");
  
  await this.setState({recrestaurants_selected_index: this.state.recrestaurants_selected_index + 5 >= this.state.recrestaurants.length? 0 : this.state.recrestaurants_selected_index + 5});
    console.log("recrestaurants_selected_index",this.state.recrestaurants_selected_index);
    const RecommendationsRowDivs = this.state.recrestaurants.slice(this.state.recrestaurants_selected_index, this.state.recrestaurants_selected_index+5).map(
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


    await this.setState({
      recrestaurants_selected: RecommendationsRowDivs,
      restaurantCityName: this.state.recrestaurants[this.state.recrestaurants_selected_index].CITY,
      restaurantStateName: this.state.recrestaurants[this.state.recrestaurants_selected_index].STATE,
      currentLoc: this.state.recrestaurants[this.state.recrestaurants_selected_index].CITY,
      currentState:this.state.recrestaurants[this.state.recrestaurants_selected_index].STATE,

    });
    this.setButtons();



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

    const url = new URL("https://localhost:8082/recommendations/");
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
      parking:this.state.parking,
      covid:this.state.covid,
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
        async (restaurantList) => {
          // console.log("=====================================================",restaurantList);
          // if (!restaurantList){
          //   console.log("entered here=======================");
          //   await this.setState({empty:true});
          //   return;
          // }
          // else{
          //   await this.setState({empty:false});
          // };

          console.log("restaurantList", restaurantList);


          // Map each keyword in this.state.keywords to an HTML element:
          // A button which triggers the showrestaurants function for each keyword.
          const RecommendationsRowDivs = restaurantList.slice(0,5).map(
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

          await this.setState({
            recrestaurants:restaurantList,
            recrestaurants_selected: RecommendationsRowDivs,
            restaurantCityName: restaurantList[0].CITY,
            restaurantStateName: restaurantList[0].STATE,
            currentLoc: restaurantList[0].CITY,
            currentState: restaurantList[0].STATE,
            day: day,
            time_start: time_now,
          });
          this.setButtons();
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      );
  }

  

  async handletimestartChange(e) {
    await this.setState({
      time_start: e.target.value,
    });

    console.log("this.state.time_start", this.state.time_start);
  }

  handleRadioChange(e, { rating, maxRating }) {
    // let s = parseInt(e.target.value);
    console.log(" starts are",rating);
    this.setState({
      star: rating,
    });
  }

  async submitrestaurant() {
    const url = new URL("https://localhost:8082/recommendations/");
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
      parking:this.state.parking,
      covid:this.state.covid,
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
        async (restaurantList) => {
          console.log("=====================================================",restaurantList);
          if (restaurantList.length===0){
            console.log("entered here=======================");
            await this.setState({empty:true});   
            await this.setState( {recrestaurants_selected:<h5>"No restaurant satisfy the selected criteria!"</h5>});  
            await this.setButtons();
            await console.log(this.state.recrestaurants_selected);
            return;
          }
          else{
            await this.setState({empty:false});
          };
          // Map each keyword in this.state.keywords to an HTML element:
          // A button which triggers the showrestaurants function for each keyword.
          // console.log(restaurantList);

          const RecommendationsRowDivs = restaurantList.slice(0,5).map(
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
            recrestaurants:restaurantList,
            recrestaurants_selected: RecommendationsRowDivs,
          });
          this.setButtons();
        },
        (err) => {
          // Print the error if there is one.
          console.log(err);
        }
      );
  }


  async advancefilter(e){

    await this.setState({advancefilterchoice: !this.state.advancefilterchoice});
    console.log("this.state.advancefilterchoice",this.state.advancefilterchoice);

  }

  advancefilterdisplay(){
    console.log("advancefilterdisplay")
    console.log("this.state.time_start",this.state.time_start)
   
    if (this.state.advancefilterchoice){
      return (
  
        <div className="input-container">  

{this.state.crusineDropdown}  
<br></br>
          <Input
          style={{height: '30px', width : '200px',  left: "-120px"}}
           size='mini'
                // icon='search'
                type="time"
                // placeholder="Enter start time"
                value={this.state.time_start}
                onChange={this.handletimestartChange}
                id="starttime"
                className="restaurant-input"
              />
    


    {/* ☆ */}
    <Rating icon='star'  defaultRating={1} maxRating={5}  size='small' onRate={this.handleRadioChange} style={{left: "-80px"}}/>
    <Checkbox label='Parking' style={{height: '30px',  left: "80px"}}  onClick={this.handleparking}/>
    <Checkbox label='Open during pandemic'  style={{height: '30px', left: "130px"}} onClick={this.handlecovid}/>
           

    </div>

      
    );
      }
      
  }




  

  
  render() {
    // console.log("this.state.empty",this.state.empty);
  
    return (

      // <style> .button2 {background-color: #008CBA;} </style>
      
      <div className="Recommendations">
        <div className="container recommendations-container">
          <div className="jumbotron jumbotron-custom">
            <div className="h5">Restaurant Recommendations</div>
            <br></br>
            <Button.Group>
      
              {this.state.citiesDropdown}


              <Button.Or />
             
              <Button 
         
              style={{height: '30px', width : '140px'}}
              animated='vertical'
              color='blue'
              onClick={this.advancefilter}
              >
              <Button.Content hidden>Advance filtering</Button.Content>

              <Button.Content visible>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filter" viewBox="0 0 16 16">
  <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
</svg>
        
              </Button.Content>    
                
              </Button>
              </Button.Group>

                 <br></br>
                 <br></br>

                 {this.advancefilterdisplay()}   


              <Button 
              style={{height: '30px', width : '130px'}}
              color='teal'
              id="submitrestaurantBtn"
              className="submit-btn"
              onClick={this.submitrestaurant}
              >Submit</Button>
             
                    
                       
  
            <div className="header-container">
        
            </div>
            <br></br>
            <br></br>
            <div>{this.state.recrestaurants_selected}</div>
            {this.state.page_buttons}
          </div>
        </div>
      </div>
    );
  }

}
