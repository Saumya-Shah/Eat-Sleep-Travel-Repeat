import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Recommendations from "./Recommendations";
import Login from "./Login";
import SideNavbar from "./SideNavbar";
import Personals from "./Personals";
import PrivateRoute from "./PrivateRoute";

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <SideNavbar />
          <Switch>
            <Route exact path="/" render={() => <Login />} />
            <PrivateRoute path="/recommendations" component={Recommendations} />
            <Route path="/login" render={() => <Login />} />
            <PrivateRoute path="/personals" component={Personals} />
          </Switch>
        </Router>
      </div>
    );
  }
}
