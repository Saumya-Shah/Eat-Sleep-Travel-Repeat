import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/FlightSearchRow.css";

export default class FlightSearchRow_NONSTOP extends React.Component {
  /* ---- Q2 (Recommendations) ---- */
  render() {
    return (
      <div className="flex-row-container">
        <div className="flex-row-item">{this.props.source_airport}</div>
        <div className="flex-row-item">{this.props.dest_airport}</div>
        <div className="flex-row-item">{this.props.time}</div>
        <div className="flex-row-item">{this.props.airlineid}</div>
      </div>
    );
  }
}

export class FlightSearchRow_ONESTOP extends React.Component {
  /* ---- Q2 (Recommendations) ---- */
  render() {
    return (
      <div className="flex-row-container">
        <div className="flex-row-item">{this.props.source_airport}</div>
        <div className="flex-row-item">{this.props.mid_airport}</div>
        <div className="flex-row-item">{this.props.dest_airport}</div>
        <div className="flex-row-item">{this.props.time}</div>
        <div className="flex-row-item">{this.props.airlineid_1}</div>
        <div className="flex-row-item">{this.props.airlineid_2}</div>
      </div>
    );
  }
}