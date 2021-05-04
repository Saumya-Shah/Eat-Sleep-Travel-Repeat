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
  var me=req.session.user.USER_NAME;
  var fl=req.body.flag;

  if(fl===2){
    var bsid=req.body.bid;
    var query = `INSERT INTO USER_FAV_RESTAURANTS (USER_NAME, BID) VALUES (:me, :bsid)`;
    console.log(query);
    const result = await connection.execute(query, [ me, bsid]);
    console.log(result);
  }
  else if (fl==3){
    var bsid=req.body.bid;
    var query = `DELETE FROM USER_FAV_RESTAURANTS WHERE USER_NAME = :me AND BID = :bsid`;
    console.log(query);
    const result = await connection.execute(query, [ me, bsid]);
    console.log(result);

  }
  else{  
  var cru = req.body.cru;
  var city_name = req.body.city.toUpperCase();
  var lat= req.body.lat;
  var lon= req.body.lon;  
  var ts=req.body.ts;
  var te=req.body.te;
  var ds=req.body.day+"_start";
  var de=req.body.day+"_end";
  var str=req.body.star;
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
  time_table AS (SELECT business_id FROM  restaurants_time WHERE `+ ds+` < :ts),
  final_table AS (  SELECT  *  FROM  time_table natural  JOIN top_rating),
    output as (select * from final_table cr natural join restaurants_pics rp)
      select business_id, name, address,city,state,stars,review_count from output ORDER BY distance fetch first 10 rows only`;

      result = await connection.execute(query, [lat,lon,ts], {
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
  time_table AS (SELECT business_id FROM  restaurants_time WHERE `+ ds+` < :ts),
  final_table2 AS (  SELECT  *  FROM  time_table natural  JOIN top_rating),
          output as (select * from final_table2 ft natural join restaurants_pics rp)
          select business_id, name, address,city,state ,stars,review_count from output fetch first 10 rows only`;


        // console.log(query);
            result = await connection.execute(query, [city_name,str,ts], {
              outFormat: oracledb.OUT_FORMAT_OBJECT,
            }); 
}

  res.json(result.rows);
}
} catch (err) {
  console.log(err);
} finally {
  // console.log("end");
}
};

const register = async (req, res) => {
try {
  // console.log("inside final register");
  // console.log(req.body);
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const password = req.body.password;

  hash = bcrypt.hashSync(password, saltRounds);

  var query = `INSERT INTO user_creds (first_name, last_name, user_name, pwd) VALUES (:first_name, :last_name, :user_name, :pwd)`;
  // console.log(query);
  const result = await connection.execute(query, [
    firstname,
    lastname,
    username,
    hash,
  ]);
  // console.log(result);
} catch (err) {
  console.log(err);
} finally {
  // console.log("end");
}
};

const login = async (req, res) => {
try {
  // console.log("inside final register");
  const username = req.body.username;
  const password = req.body.password;

  var query = `SELECT * FROM user_creds WHERE user_name= :username`;
  // console.log(query);
  const result = await connection.execute(query, [username], {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  });
  // console.log(result);
  if (result.rows.length > 0) {
    bcrypt.compare(password, result.rows[0].PWD, (err, ans) => {
      // console.log(ans);
      if (ans) {
        // console.log("Password matched!!");
        req.session.user = result.rows[0];
        // console.log(req.session.user);
        res.json(result.rows);
      } else {
        // console.log("Not matched");
        res.json({ message: "Wrong username/password combination!" });
      }
    });
    // console.log("Found");
  } else {
    // console.log("Not Found");
    res.json({ message: "User doesn't exist!" });
  }
} catch (err) {
  console.log(err);
} finally {
  // console.log("end");
}
};

const getFavoriteRestaurants = async (req, res) => {
try {
  // console.log(req.session.user.USER_NAME);
  const user_name = req.session.user.USER_NAME;
  var query = `with fav_restaurants as (select * from restaurants r join user_fav_restaurants ufr on r.business_id = ufr.BID where ufr.user_name=:user_name),
  restaurants_with_feats as (select * from fav_restaurants natural join restaurants_features)
  select * from restaurants_with_feats`;
  const result = await connection.execute(query, [user_name], {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  });
  // console.log(result.rows);
  // console.log("get fav restaurants works!");
  res.json(result.rows);
} catch (err) {
  console.log(err);
} finally {
  // console.log("end");
}
};

const getVisitedRestaurants = async (req, res) => {
  try {
    // console.log(req.session.user.USER_NAME);
    const user_name = req.session.user.USER_NAME;
    var query = `with fav_restaurants as (select * from restaurants r join user_visited_restaurants ufr on r.business_id = ufr.BID where ufr.user_name=:user_name),
    restaurants_with_feats as (select * from fav_restaurants natural join restaurants_features)
    select * from restaurants_with_feats`;
    const result = await connection.execute(query, [user_name], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    // console.log(result.rows);
    // console.log("get fav restaurants works!");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    // console.log("end");
  }
};

const getRestaurantsCities = async (req, res) => {
  try {
    var query = `select distinct UPPER(city) as CITY from restaurants order by CITY`;
    const result = await connection.execute(query, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    res.json(result.rows);
    // console.log(result.rows);
  } catch (err) {
    console.log(err);
  } finally {
    // console.log("end");
  }
};


const FlightSearch = async (req, res) => {
try {
  var sourceCity = req.params.sourceCity;
  var destCity = req.params.destCity;
  var stops = req.params.stops;
  if (stops == 0){ // non-stop routes
    // console.log("[FlightSearch]: non stop case!");
    var query = `select sa.name as source_airport, da.name as dest_airport, round(111.138 * sqrt(power(((sa.Latitude) - da.latitude), 2) + power(((sa.Longitude) - da.longitude), 2)) / 500, 1) as time, airlineid
    from routes
    join airports sa on sa.airportid = routes.source_airportid
    join airports da on da.airportid = routes.destination_airportid
    where sa.city =:sourceCity and da.city =:destCity fetch next 5 rows only`;
  }else if(stops == 1){ // one-stop routes
    // console.log("[FlightSearch]: one stop case!");
    var query = `with from_source as(
      select sa.name as source_airport, da.name as dest_airport, round(111.138 * sqrt(power(((sa.Latitude) - da.latitude), 2) + power(((sa.Longitude) - da.longitude), 2)) / 500, 1) as time, airlineid
      from routes
      join airports sa on sa.airportid = routes.source_airportid
      join airports da on da.airportid = routes.destination_airportid
      where sa.city =:destCity
    ),
    to_dest as(
      select sa.name as source_airport, da.name as dest_airport, round(111.138 * sqrt(power(((sa.Latitude) - da.latitude), 2) + power(((sa.Longitude) - da.longitude), 2)) / 500, 1) as time, airlineid
      from routes
      join airports sa on sa.airportid = routes.source_airportid
      join airports da on da.airportid = routes.destination_airportid
      where da.city =:sourceCity
    )
    select a2.name as source_airport, td.source_airport as mid_airport, td.dest_airport, (td.time + round(111.138 * sqrt(power(((a1.Latitude) - a2.latitude), 2) + power(((a1.Longitude) - a2.longitude), 2)) / 500, 1)) as time, routes.airlineid as airlineid_2, td.airlineid as airlineid_1
    from to_dest td join airports a1 on a1.name = td.source_airport
    join routes on routes.destination_airportid = a1.airportid
    join airports a2 on a2.airportid = routes.source_airportid
    where a2.city =:sourceCity
    union
    select fs.source_airport as source_airport, fs.dest_airport as mid_airport, a2.name as dest_airport, (fs.time + round(111.138 * sqrt(power(((a1.Latitude) - a2.latitude), 2) + power(((a1.Longitude) - a2.longitude), 2)) / 500, 1)) as time, fs.airlineid as airlineid_1, routes.airlineid as airlineid_2
    from from_source fs join airports a1 on a1.name = fs.dest_airport
    join routes on routes.source_airportid = a1.airportid
    join airports a2 on a2.airportid = routes.destination_airportid
    where a2.city =:destCity
    order by time asc fetch next 5 rows only`;
  }else{//two stop routes
    var query = `with from_source as(
      select sa.name as source_airport, da.name as dest_airport, ma.name as mid_airport, round(111.138 * sqrt(power(((sa.Latitude) - ma.latitude), 2) + power(((sa.Longitude) - ma.longitude), 2)) / 500, 1) + round(111.138 * sqrt(power(((ma.Latitude) - da.latitude), 2) + power(((ma.Longitude) - da.longitude), 2)) / 500, 1) as time, r1.airlineid as airlineid_1, r2.airlineid as airlineid_2
      from routes r1
      join airports sa on sa.airportid = r1.source_airportid
      join airports ma on ma.airportid = r1.destination_airportid
      join routes r2 on r2.source_airportid = ma.airportid
      join airports da on da.airportid = r2.destination_airportid
      where sa.airportid <> da.airportid and sa.city =:sourceCity
    ),
    to_dest as(
      select sa.name as source_airport, da.name as dest_airport, ma.name as mid_airport, round(111.138 * sqrt(power(((sa.Latitude) - ma.latitude), 2) + power(((sa.Longitude) - ma.longitude), 2)) / 500, 1) + round(111.138 * sqrt(power(((ma.Latitude) - da.latitude), 2) + power(((ma.Longitude) - da.longitude), 2)) / 500, 1) as time, r1.airlineid as airlineid_1, r2.airlineid as airlineid_2
      from routes r1
      join airports sa on sa.airportid = r1.source_airportid
      join airports ma on ma.airportid = r1.destination_airportid
      join routes r2 on r2.source_airportid = ma.airportid
      join airports da on da.airportid = r2.destination_airportid
      where sa.airportid <> da.airportid and da.city =:destCity
    )
    select a2.name as source_airport, td.source_airport as mid_airport_1, td.mid_airport as mid_airport_2, td.dest_airport, (td.time + round(111.138 * sqrt(power(((a1.Latitude) - a2.latitude), 2) + power(((a1.Longitude) - a2.longitude), 2)) / 500, 1)) as time, routes.airlineid as airlineid_1, td.airlineid_1 as airlineid_2, td.airlineid_2 as airlineid_3
    from to_dest td join airports a1 on a1.name = td.source_airport
    join routes on routes.destination_airportid = a1.airportid
    join airports a2 on a2.airportid = routes.source_airportid
    where a2.city =:sourceCity
    union
    select fs.source_airport as source_airport, fs.mid_airport as mid_airport_1, fs.dest_airport as mid_airport_2, a2.name as dest_airport, (fs.time + round(111.138 * sqrt(power(((a1.Latitude) - a2.latitude), 2) + power(((a1.Longitude) - a2.longitude), 2)) / 500, 1)) as time, fs.airlineid_1, fs.airlineid_2, routes.airlineid as airlineid_3
    from from_source fs join airports a1 on a1.name = fs.dest_airport
    join routes on routes.source_airportid = a1.airportid
    join airports a2 on a2.airportid = routes.destination_airportid
    where a2.city =:destCity
    order by time asc fetch next 5 rows only`;
  }
  const result = await connection.execute(query, [sourceCity, destCity], {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  });
  // console.log(result.metaData);
  // console.log(result.rows[0]);
  res.json(result.rows);
} catch (err) {
  console.log(err);
} finally {
  // console.log("end");
}
};

const getCity = async (req, res) => {
try {
  var lat = req.body.lat;
  var lon = req.body.lon;
  console.log(lat, lon);
  var query = `with nearby_cities_dist as(
    select a1.city, a1.country, min(round(111.138 * sqrt(power(((a1.Latitude) - :lat), 2) + power(((a1.Longitude) - :lon), 2)), 4)) as distance
    from airports a1
    group by a1.city, a1.country
)
select *
from nearby_cities_dist
order by distance ASC
fetch next 5 rows only`;
  const result = await connection.execute(query, [lat, lon], {
    outFormat: oracledb.OUT_FORMAT_OBJECT,
  });
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
  getVisitedRestaurants: getVisitedRestaurants,
  getCity: getCity,
  FlightSearch: FlightSearch,
  getRestaurantsCities: getRestaurantsCities,
  
};
