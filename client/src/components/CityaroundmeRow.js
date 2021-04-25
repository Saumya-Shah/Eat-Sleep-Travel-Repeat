import React from "react";
import "../style/CityaroundmeRow.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default class CityaroundmeRow extends React.Component {
/* ---- Q2 (Recommendations) ---- */
  render() {
    return (
      <div className="flex-row-container">
          <div className="flex-row-item">{this.props.destination_id}</div>
          <div className="flex-row-item">{this.props.city}</div>
          <div className="flex-row-item">{this.props.distance}</div>
      </div>
    );
  }
}