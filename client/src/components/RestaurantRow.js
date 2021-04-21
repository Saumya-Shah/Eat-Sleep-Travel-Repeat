import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class RecommendationsRow extends React.Component {
  /* ---- Q2 (Recommendations) ---- */
  render() {
    return (
      <div className="restaurantResults">
        <div className="name">{this.props.name}</div>
        <div className="address">{this.props.address}</div>
        <div className="city">{this.props.city}</div>
        <div className="state">{this.props.state}</div>
      </div>
    );
  }
}
