const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
var routes = require("./routes.js");
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('../key.pem', 'utf8');
var certificate = fs.readFileSync('../cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};


const app = express();

var httpsServer = https.createServer(credentials, app);
httpsServer.listen(8082,()=>{console.log("Server listening on Port 8082");});

app.use(
  cors({
    credentials: true,
    origin: "https://localhost:3000",
    methods: ["GET", "POST"],
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userID",
    secret: "cis550fp",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 60 * 60 * 24 *1000},
  })
);

app.post("/recommendations", routes.getRecs);
app.post("/register", routes.register);
app.post("/login", routes.login);

app.get("/login", (req, res) => {
  if (req.session.user != null) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.get("/logout", (req, res) => {
  req.session.user = null;
  res.send({ loggedIn: false });
});

app.get("/test", routes.getRecs);
// app.get("/cityaroundme/",routes.getCity);
app.post("/cityaroundme/", routes.getNearbyCity);
app.get("/popularCity", routes.getPopularCity);
app.get("/trip", routes.getTrip);
app.get("/FlightSearch/:sourceCity/:destCity/:stops",routes.FlightSearch);


app.get("/get_fav_res", routes.getFavoriteRestaurants);
app.get("/get_res_cities", routes.getRestaurantsCities);
app.get("/get_visi_res", routes.getVisitedRestaurants);
app.get("/get_fav_places", routes.getFavoriteRestaurants);
app.get("/get_visited_places", routes.getFavoriteRestaurants);


process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here
  process.exit(1);
});
