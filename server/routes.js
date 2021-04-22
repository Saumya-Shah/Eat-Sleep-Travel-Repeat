const oracledb = require("oracledb");
oracledb.autoCommit = true;
const { user } = require("./db-config.js");
const dbConfig = require("./db-config.js");
const bcrypt = require("bcrypt");

const saltRounds = 10;
dbConfig.connectionLimit = 10;
let connection;
async function set_connection() {
  connection = await oracledb.getConnection(dbConfig);
}

set_connection();

const getRecs = async (req, res) => {
  try {

    var cru = req.body.cru;
    var city_name = req.body.city;
    var lat= req.body.lat;
    var lon= req.body.lon;
    var fl=req.body.flag;
    var result="";
    let query="";

    if (fl==1){
      query=`WITH distance_table AS ( SELECT round(   111.138 * sqrt(  power(((Latitude) - :lat), 2) + power(((Longitude) + abs(:lon)), 2) ), 4) 
      AS distance, business_id FROM  Restaurants ),
      city_name_closest as (SELECT city FROM  distance_table NATURAL JOIN restaurants ORDER BY distance fetch first 1 rows only), 
      city_restaurants as (select * from restaurants where city= (select city from city_name_closest )),
      food_indian as (select * from city_restaurants natural join restaurants_features rf where upper(rf.categories) like '%INDIAN,%' and rf.covid='True'
      order by rf.stars desc, rf.review_count desc fetch first 5 rows only),
      food_italian as (select * from city_restaurants natural join restaurants_features rf where upper(rf.categories) like '%ITALIAN,%' and rf.covid='True'
      order by rf.stars desc, rf.review_count desc fetch first 5 rows only),
      food_chinese as (select * from city_restaurants natural join restaurants_features rf where upper(rf.categories) like '%CHINESE,%' and rf.covid='True'
      order by rf.stars desc, rf.review_count desc fetch first 5 rows only),
      final_table as( (select food_indian.*,'INDIAN' as cruisine from food_indian) union
      (select food_italian.*,'ITALIAN' as cruisine from food_italian) union
      (select food_chinese.*,'CHINESE' as cruisine from food_chinese) ),
        output as (select * from final_table ft natural join restaurants_pics rp)
        select name, address,city,state from output`;



        result = await connection.execute(query, [lat,lon], {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        });
     }
     

else{

query=`with city_restaurants as (select * from restaurants where city=:city_name),
 food_indian as (select * from city_restaurants natural join restaurants_features rf where upper(rf.categories) like '%INDIAN,%' and rf.covid='True'
 order by rf.stars desc, rf.review_count desc fetch first 5 rows only),
 food_italian as (select * from city_restaurants natural join restaurants_features rf where upper(rf.categories) like '%ITALIAN,%' and rf.covid='True'
 order by rf.stars desc, rf.review_count desc fetch first 5 rows only),
 food_chinese as (select * from city_restaurants natural join restaurants_features rf where upper(rf.categories) like '%CHINESE,%' and rf.covid='True'
 order by rf.stars desc, rf.review_count desc fetch first 5 rows only),
 final_table as( (select food_indian.*,'INDIAN' as cruisine from food_indian) union
 (select food_italian.*,'ITALIAN' as cruisine from food_italian) union
 (select food_chinese.*,'CHINESE' as cruisine from food_chinese) ),
  output as (select * from final_table ft natural join restaurants_pics rp)
  select name, address,city,state from output`;


    if (cru==="Indian"){

      query =  `WITH city_restaurants AS (SELECT * FROM restaurants WHERE city = :city_name),
          output AS ( SELECT * FROM city_restaurants natural JOIN restaurants_features rf
         WHERE rf.covid = 'True' and Upper(rf.categories)  LIKE '%INDIAN,%' ORDER BY rf.stars desc, rf.review_count desc FETCH first 5 ROWS only)
         select name,address,city,state from output `;
    }
    else if (cru==="Chinese"){
      query = `WITH city_restaurants AS  ( SELECT * FROM restaurants WHERE city = :city_name  ),
         output AS ( SELECT * FROM city_restaurants natural JOIN restaurants_features rf 
          WHERE rf.covid = 'True' and Upper(rf.categories) LIKE '%CHINESE,%' ORDER BY rf.stars desc, rf.review_count desc 
        FETCH first 5 ROWS only )
         SELECT name, address, city, state FROM output `;
    }
    else if (cru==="Italian"){
      query=`WITH city_restaurants AS (SELECT * FROM restaurants WHERE city = :city_name),
          output AS ( SELECT * FROM city_restaurants natural JOIN restaurants_features rf
         WHERE rf.covid = 'True' and Upper(rf.categories)  LIKE '%ITALIAN,%' ORDER BY rf.stars desc, rf.review_count desc 
         FETCH first 5 ROWS only)
         select name,address,city,state from output `;
    }
    result = await connection.execute(query, [city_name], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
  }

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

    hash = bcrypt.hashSync(password, saltRounds);

    var query = `INSERT INTO user_creds (first_name, last_name, user_name, pwd) VALUES (:first_name, :last_name, :user_name, :pwd)`;
    console.log(query);
    const result = await connection.execute(query, [
      firstname,
      lastname,
      username,
      hash,
    ]);
    console.log(result);
  } catch (err) {
    console.log(err);
  } finally {
    console.log("end");
  }
};

const login = async (req, res) => {
  try {
    console.log("inside final register");
    const username = req.body.username;
    const password = req.body.password;

    var query = `SELECT * FROM user_creds WHERE user_name= :username`;
    console.log(query);
    const result = await connection.execute(query, [username], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    console.log(result);
    if (result.rows.length > 0) {
      bcrypt.compare(password, result.rows[0].PWD, (err, ans) => {
        console.log(ans);
        if (ans) {
          console.log("Password matched!!");
          req.session.user = result.rows[0];
          console.log(req.session.user);
          res.json(result.rows);
        } else {
          console.log("Not matched");
          res.json({ message: "Wrong username/password combination!" });
        }
      });
      console.log("Found");
    } else {
      console.log("Not Found");
      res.json({ message: "User doesn't exist!" });
    }
  } catch (err) {
    console.log(err);
  } finally {
    console.log("end");
  }
};

module.exports = {
  getRecs: getRecs,
  register: register,
  login: login,
};
