import React from 'react';
import Axios from "axios";
import { Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'


export default class DropDownCity extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            cityNames: [],
        }
    }
    
    

    componentDidMount(){
        console.log("component did mount called");
        Axios.get("http://localhost:8082/get_res_cities").then((response) => {
        var cityOptions = response.data.map((cityObj, i)=> ({
            key: i+1, 
            text: cityObj.CITY + ", " + cityObj.STATE, 
            value: cityObj.CITY + ", " + cityObj.STATE, 
        }));
        cityOptions.unshift({key:0, text: "Current Location", value: "Current Location"});
        // console.log(cityOptions);
        this.setState({cityNames: cityOptions})
        }
        );
    }

    render() { 
        return <Dropdown placeholder='City' 
        search 
        selection 
        fluid
        options={this.state.cityNames} 
        onChange={this.props.onInputChange}/>;
    }
}

