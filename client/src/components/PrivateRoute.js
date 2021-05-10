import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import Axios from "axios";

/**
 * Private route component helps move forward to a specific page only if user is logged in
 * Mainly used for pages which provide personalized experience to users and require them to be logged in.
 */
const PrivateRoute = ({ component: Component, ...rest }) => {
  
  const [isLoading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    Axios.get("https://localhost:8082/login").then((response) => {
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
