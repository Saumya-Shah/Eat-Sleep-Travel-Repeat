import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/FlightSearchRow.css";
import "../style/FlightSearch.css";

export default class FlightSearchRow_NONSTOP extends React.Component {
  /* ---- Q2 (Recommendations) ---- */
  render() {
    const renderAirportSwitch = () =>{
      if (this.props.mid_airport == null && this.props.mid_airport_1 == null){
        return(
        <div className="flex-row-container">
        <div className="flex-row-item">{this.props.source_airport}</div>
        <div className="flex-row-item">{this.props.dest_airport}</div>
        <div className="flex-row-item">{this.props.time}</div>
        <div className="flex-row-item">{this.props.airlineid}</div>
        <hr class="solid" />
        </div>);
      }else if (this.props.mid_airport != null){
        return(
        <div className="flex-row-container">
         <div className="flex-row-item">{this.props.source_airport}</div>
         <div className="flex-row-item">{this.props.mid_airport}</div>
         <div className="flex-row-item">{this.props.dest_airport}</div>
         <div className="flex-row-item">{this.props.time}</div>
         <div className="flex-row-item">{this.props.airlineid_1}</div>
         <div className="flex-row-item">{this.props.airlineid_2}</div>
         <hr class="solid" />
       </div>);
      }else if(this.props.mid_airport_1 != null){
        return(
        <div className="flex-row-container">
        <div className="flex-row-item">{this.props.source_airport}</div>
        <div className="flex-row-item">{this.props.mid_airport_1}</div>
        <div className="flex-row-item">{this.props.mid_airport_2}</div>
        <div className="flex-row-item">{this.props.dest_airport}</div>
        <div className="flex-row-item">{this.props.time}</div>
        <div className="flex-row-item">{this.props.airlineid_1}</div>
        <div className="flex-row-item">{this.props.airlineid_2}</div>
        <div className="flex-row-item">{this.props.airlineid_3}</div>
        <hr class="blackline" />

        </div>);
      }
    }
  return(
    renderAirportSwitch()

  );
  }
  
}


     



