import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Recommendations from "./Recommendations";
import Login from "./Login";
export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" render={() => <Recommendations />} />
            <Route path="/recommendations" render={() => <Recommendations />} />
            <Route path="/login" render={() => <Login />} />
          </Switch>
        </Router>
      </div>
    );
  }
}
