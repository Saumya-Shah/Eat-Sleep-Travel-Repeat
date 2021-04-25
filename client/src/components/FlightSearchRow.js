import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/FlightSearchRow.css";

export default class FlightSearchRow extends React.Component {
  /* ---- Q2 (Recommendations) ---- */
  render() {
    return (
      <div className="flex-row-container">
        <div className="flex-row-item">{this.props.sourceCity}</div>
        <div className="flex-row-item">{this.props.destCity}</div>
        <div className="flex-row-item">{this.props.time}</div>
        <div className="flex-row-item">{this.props.airlineid}</div>
      </div>
    );
  }
}