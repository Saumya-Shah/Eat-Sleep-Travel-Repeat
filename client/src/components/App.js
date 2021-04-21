import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Recommendations from "./Recommendations";
import Login from "./Login";
import SideNavbar from "./SideNavbar";
import Personals from "./Personals";
export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <SideNavbar />
          <Switch>
            <Route exact path="/" render={() => <Login />} />
            <Route path="/recommendations" render={() => <Recommendations />} />
            <Route path="/login" render={() => <Login />} />
            <Route path="/personals" render={() => <Personals />} />
          </Switch>
        </Router>
      </div>
    );
  }
}
