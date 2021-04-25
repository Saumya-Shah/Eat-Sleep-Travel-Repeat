import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class FlightSearchRow extends React.Component {
  /* ---- Q2 (Recommendations) ---- */
  render() {
    return (
      <div className="FlightsearchResults">
        <div className="sourceCity">{this.props.sourceCity}</div>
        <div className="destCity">{this.props.destCity}</div>
        <div className="time">{this.props.time}</div>
        <div className="airlineid">{this.props.airlineid}</div>
      </div>
    );
  }
}