import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import Axios from "axios";

const PrivateRoute = ({ component: Component, ...rest }) => {
  // Add your own authentication on the below line.
  const [isLoading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    Axios.get("http://localhost:8082/login").then((response) => {
      console.log(response.data);
      if (response.data.loggedIn) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setLoading(false);
    });
  }, []);

  if (isLoading) {
    console.log("is loading");
    console.log(isLoggedIn);
    return <div className="App">Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
