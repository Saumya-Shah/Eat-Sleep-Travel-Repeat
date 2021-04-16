const bodyParser = require("body-parser");
const express = require("express");
var routes = require("./routes.js");
const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json);

app.get("/recommendations/:state_name", routes.getRecs);
// app.post("/register/", (req, res) => {
//   console.log("called");
//   res.end();
// });
app.get("/test", routes.getRecs);

app.listen(8084, () => {
  console.log(`Server listening on PORT 8084`);
});

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here
  process.exit(1);
});
