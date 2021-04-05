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

module.exports = {
  getRecs: getRecs,
};
