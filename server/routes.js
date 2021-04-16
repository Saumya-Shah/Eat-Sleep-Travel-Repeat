const oracledb = require("oracledb");
const dbConfig = require("./db-config.js");

dbConfig.connectionLimit = 10;
let connection;
async function set_connection() {
  connection = await oracledb.getConnection(dbConfig);
}

set_connection();

const getRecs = async (req, res) => {
  try {
    console.log("inside getRecs");
    var state_name = req.params.state_name;

    var query = `SELECT * FROM restaurants WHERE state = :state_name FETCH first 5 ROWS only`;
    const result = await connection.execute(query, [state_name], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    // console.log(result.metaData);
    console.log(result.rows);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    console.log("end");
  }
};

const register = async (req, res) => {
  try {
    console.log("Inside register");
    const first_name = req.body.firstname;
    const last_name = req.body.lastname;
    const user_name = req.body.username;
    const password = req.body.password;
    var query = `SELECT * FROM restaurants WHERE state = PA FETCH first 5 ROWS only`;

    var query2 = `INSERT INTO user_creds ( first_name, last_name, user_name, pwd) VALUES (:first_name, :last_name)`;
    console.log(query);
    const result = await connection.execute(query, [state_name], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    // console.log(result.metaData);
    console.log(result.rows);

    res.json(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    console.log("end");
  }
};

module.exports = {
  getRecs: getRecs,
};
