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
    var city_name = req.body.city.toUpperCase();
    var lat= req.body.lat;
    var lon= req.body.lon;
    var fl=req.body.flag;
    var ts=req.body.ts;
    var te=req.body.te;
    var ds=req.body.day+"_start";
    var de=req.body.day+"_end";
    var str=req.body.star;
    console.log("strtsss",str);
    var result="";
    let query="";
  
    if (fl==1){
      query=`WITH distance_table AS ( SELECT round(   111.138 * sqrt(  power(((Latitude) - :lat), 2) + power(((Longitude) + abs(:lon)), 2) ), 4) 
      AS distance, business_id FROM  Restaurants ),
      city_name_closest as (SELECT * FROM  distance_table NATURAL JOIN restaurants), 
      features_joined AS (   SELECT    *   FROM  city_name_closest natural JOIN restaurants_features ORDER BY distance),
      grouped_postal_code AS (  SELECT   postal_code,  Avg(stars) AS avg_rate   FROM  features_joined GROUP BY (postal_code)),
    grouped_area_features AS (  SELECT  *  FROM grouped_postal_code natural JOIN features_joined ORDER BY distance),
    top_rating AS (  SELECT * FROM grouped_area_features  WHERE stars >= avg_rate ORDER BY distance),
    time_table AS (SELECT business_id FROM  restaurants_time WHERE `+ ds+` < :ts  AND `+de+` > :te),
    final_table AS (  SELECT  *  FROM  time_table natural  JOIN top_rating),
      output as (select * from final_table cr natural join restaurants_pics rp)
        select name, address,city,state,stars,review_count from output ORDER BY distance fetch first 10 rows only`;

        result = await connection.execute(query, [lat,lon,ts,te], {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        });
     }
     

else{
    var q=``; 
    if (cru.length>0){

      for (var i=0;i<cru.length;i++){
          q=q+cru[i]+ ` as (select * from city_restaurants natural join restaurants_features rf where upper(rf.categories) like '%`+cru[i]+`,%' and rf.covid='True'\
                  order by rf.stars desc, rf.review_count desc fetch first 5 rows only), `       
        }
                
      q=q+` final_table as ( `;

      for (var i=0;i<cru.length-1;i++){
          q=q+`(select * from `+cru[i]+` ) union`    
        }

              
      q=q+ ` (select * from `+ cru[cru.length-1]+` )),`

      }

    else{
      q=q+` final_table as ( select * from city_restaurants NATURAL JOIN restaurants_features ), `;
   }
          
    query=`with city_restaurants as (select * from restaurants where  UPPER(city)=:city_name), `+ q + 
    `top_rating AS (  SELECT * FROM final_table  WHERE stars >= :str ),
    time_table AS (SELECT business_id FROM  restaurants_time WHERE `+ ds+` < :ts  AND `+de+` > :te),
    final_table2 AS (  SELECT  *  FROM  time_table natural  JOIN top_rating),
            output as (select * from final_table2 ft natural join restaurants_pics rp)
            select name, address,city,state ,stars,review_count from output fetch first 10 rows only`;


          console.log(query);
              result = await connection.execute(query, [city_name,str,ts,te], {
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

const getFavoriteRestaurants = async (req, res) => {
  try {
    console.log(req.session.user.USER_NAME);
    const user_name = req.session.user.USER_NAME;
    var query = `with fav_restaurants as (select * from restaurants r join user_fav_restaurants ufr on r.business_id = ufr.BID where ufr.user_name=:user_name),
    restaurants_with_feats as (select * from fav_restaurants natural join restaurants_features)
    select * from restaurants_with_feats`;
    const result = await connection.execute(query, [user_name], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    console.log(result.rows);
    console.log("get fav restaurants works!");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    console.log("end");
  }
};




const FlightSearch = async (req, res) => {
  /* TODO: FINISH FLIGHT SEARCH PAGE */
  try {
    var sourceCity = req.params.sourceCity;
    var destCity = req.params.destCity;
    var stops = req.params.stops;
    console.log(sourceCity,"here!");
    



    var query = `select 1 as sourceCity, 1 as destCity, 1 as time, 1 as airlineid
    from airports
    where city='Chicago'`;
    const result = await connection.execute(query, [], {
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

const getCity = async (req, res) => {
  try {
    var city_name = req.params.city_name;
    console.log("[getCity]:city name obtained:", city_name);
    var query = `with current_location as (
      select
          latitude,
          longitude,
          airportid
      from
          airports
      where
          name= :city_name
  ),
  distance_table as (
      select
          round(
              111.138 * sqrt(
                  power(((ap.Latitude) - cl.latitude), 2) + power(((ap.Longitude) - cl.longitude), 2)
              ),
              4
          ) as distance,
          city,
          name
      from
          airports ap,
          current_location cl
  ),
  city_within_range as(
      select
          ap.airportid,
          ap.name,
          ap.city,
          dt.distance,
          dt.distance / 500 as flight_time
      from
          airports ap,
          distance_table dt
      where
          dt.distance / 500 <= 3
          and dt.name = ap.name
      order by
          dt.distance ASC
  ),
  zero_stop as (
      select
          distinct r.destination_airportid as destination_id,
          cwr.city,
          cwr.distance,
          0 as stop
      from
          routes r,
          airports ap,
          city_within_range cwr,
          current_location cl
      where
          r.destination_airportid = cwr.airportid
          and r.source_airportid = cl.airportid
  )
  select
      *
  from
      zero_stop
  order by
      distance fetch next 5 rows only`;
    const result = await connection.execute(query, [city_name], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    console.log("result got!");
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
  register: register,
  login: login,
  getFavoriteRestaurants: getFavoriteRestaurants,
  getCity: getCity,
  FlightSearch: FlightSearch,
  
};
