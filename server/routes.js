const oracledb = require("oracledb");
oracledb.autoCommit = true;
const { user } = require("./db-config.js");
const dbConfig = require("./db-config.js");

dbConfig.connectionLimit = 10;
let connection;
async function set_connection() {
  connection = await oracledb.getConnection(dbConfig);
}

set_connection();

const getRecs = async (req, res) => {
  try {
    var state_name = req.params.state_name;

    var query = `SELECT * FROM restaurants WHERE state = :state_name FETCH first 5 ROWS only`;
    const result = await connection.execute(query, [state_name], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    console.log(result.metaData);
    console.log(result.rows[0]);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    console.log("end");
  }
};

const register = async (req, res) => {
  try {
    console.log("inside final register");
    console.log(req.body);
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const username = req.body.username;
    const password = req.body.password;

    var query = `INSERT INTO user_creds (first_name, last_name, user_name, pwd) VALUES ('Saumya', 'Shah', 'saumya1997', 'saumya123')`;
    console.log(query);
    const result = await connection.execute(query);
    console.log(result);
  } catch (err) {
    console.log(err);
  } finally {
    console.log("end");
  }
};

module.exports = {
  getRecs: getRecs,
  register: register,
};
