create materialized view restaurants_full (
    business_id,
    name,
    address,
    city,
    stars,
    categories
) as
select
    r.business_id,
    r.name,
    r.address,
    r.city,
    rf.stars,
    rf.categories
from
    restaurants r
    join restaurants_features rf on r.business_id = rf.business_id;

/* 
 query 1(easy): Find nearby cities(in the united states) that are within 3-hour flight distance to user's location 
 */
with nearby_cities_dist as(
    select a1.city, min(round(111.138 * sqrt(power(((a1.Latitude) - :lat), 2) + power(((a1.Longitude) - :lon), 2)), 4)) as distance
    from airports a1
    group by a1.city
)
select *
from nearby_cities_dist
order by distance ASC
fetch next 20 rows only;

/* 
 query 2(easy): recommend user with popular cities to travel to in the united states
 popular city defination: the city that appears as "destination" in routes table most frequently and has most restaurants with star>3
 */
with popular_flight_city as (
    select ap.city as city, count(*) AS flt_cnt
    from Routes r join airports ap on r.destination_airportid = ap.airportid
    where ap.country = 'United States'
    group by ap.city
),
city_restaurants_cnt as (
    select
        city,
        count(restaurants.business_id) as rest_cnt
    from
        restaurants
        join restaurants_features on restaurants_features.business_id = restaurants.business_id
    where
        restaurants_features.stars > 3
    group by
        city
)
select pfc.city
from popular_flight_city pfc join city_restaurants_cnt cr on pfc.city = cr.city
order by flt_cnt+rest_cnt DESC fetch next 5 rows only;

/* 
 query 3(easy): flight search based on:
 1. source city
 2. destination city
 3. non-stop, one-stop or two-stop
 4. no traveling outside of the original country

 return format:
 (source_airport, dest_airport, time, airlineid) 
 */
-- case1: non-stop case
select sa.name as source_airport, da.name as dest_airport, round(111.138 * sqrt(power(((sa.Latitude) - da.latitude), 2) + power(((sa.Longitude) - da.longitude), 2)) / 500, 1) as time, airlineid
from routes
join airports sa on sa.airportid = routes.source_airportid
join airports da on da.airportid = routes.destination_airportid
where sa.city = 'Chicago' and da.city = 'New York';
-- case2: one-stop case
with from_source as(
  select sa.name as source_airport, da.name as dest_airport, round(111.138 * sqrt(power(((sa.Latitude) - da.latitude), 2) + power(((sa.Longitude) - da.longitude), 2)) / 500, 1) as time, airlineid
  from routes
  join airports sa on sa.airportid = routes.source_airportid
  join airports da on da.airportid = routes.destination_airportid
  where sa.city = 'Chicago'
),
to_dest as(
  select sa.name as source_airport, da.name as dest_airport, round(111.138 * sqrt(power(((sa.Latitude) - da.latitude), 2) + power(((sa.Longitude) - da.longitude), 2)) / 500, 1) as time, airlineid
  from routes
  join airports sa on sa.airportid = routes.source_airportid
  join airports da on da.airportid = routes.destination_airportid
  where da.city = 'New York'
)
select a2.name as source_airport, td.source_airport as mid_airport, td.dest_airport, (td.time + round(111.138 * sqrt(power(((a1.Latitude) - a2.latitude), 2) + power(((a1.Longitude) - a2.longitude), 2)) / 500, 1)) as time, routes.airlineid as airlineid_2, td.airlineid as airlineid_1
from to_dest td join airports a1 on a1.name = td.source_airport
join routes on routes.destination_airportid = a1.airportid
join airports a2 on a2.airportid = routes.source_airportid
where a2.city = 'Chicago'
union
select fs.source_airport as source_airport, fs.dest_airport as mid_airport, a2.name as dest_airport, (fs.time + round(111.138 * sqrt(power(((a1.Latitude) - a2.latitude), 2) + power(((a1.Longitude) - a2.longitude), 2)) / 500, 1)) as time, fs.airlineid as airlineid_1, routes.airlineid as airlineid_2
from from_source fs join airports a1 on a1.name = fs.dest_airport
join routes on routes.source_airportid = a1.airportid
join airports a2 on a2.airportid = routes.destination_airportid
where a2.city = 'New York'
order by time asc;
-- case3: two-stop case
with from_source as(
  select sa.name as source_airport, da.name as dest_airport, ma.name as mid_airport, round(111.138 * sqrt(power(((sa.Latitude) - ma.latitude), 2) + power(((sa.Longitude) - ma.longitude), 2)) / 500, 1) + round(111.138 * sqrt(power(((ma.Latitude) - da.latitude), 2) + power(((ma.Longitude) - da.longitude), 2)) / 500, 1) as time, r1.airlineid as airlineid_1, r2.airlineid as airlineid_2
  from routes r1
  join airports sa on sa.airportid = r1.source_airportid
  join airports ma on ma.airportid = r1.destination_airportid
  join routes r2 on r2.source_airportid = ma.airportid
  join airports da on da.airportid = r2.destination_airportid
  where sa.airportid <> da.airportid and sa.city = 'Chicago'
),
to_dest as(
  select sa.name as source_airport, da.name as dest_airport, ma.name as mid_airport, round(111.138 * sqrt(power(((sa.Latitude) - ma.latitude), 2) + power(((sa.Longitude) - ma.longitude), 2)) / 500, 1) + round(111.138 * sqrt(power(((ma.Latitude) - da.latitude), 2) + power(((ma.Longitude) - da.longitude), 2)) / 500, 1) as time, r1.airlineid as airlineid_1, r2.airlineid as airlineid_2
  from routes r1
  join airports sa on sa.airportid = r1.source_airportid
  join airports ma on ma.airportid = r1.destination_airportid
  join routes r2 on r2.source_airportid = ma.airportid
  join airports da on da.airportid = r2.destination_airportid
  where sa.airportid <> da.airportid and da.city = 'New York'
)
select a2.name as source_airport, td.source_airport as mid_airport_1, td.mid_airport as mid_airport_2, td.dest_airport, (td.time + round(111.138 * sqrt(power(((a1.Latitude) - a2.latitude), 2) + power(((a1.Longitude) - a2.longitude), 2)) / 500, 1)) as time, routes.airlineid as airlineid_1, td.airlineid_1 as airlineid_2, td.airlineid_2 as airlineid_3
from to_dest td join airports a1 on a1.name = td.source_airport
join routes on routes.destination_airportid = a1.airportid
join airports a2 on a2.airportid = routes.source_airportid
where a2.city = 'Chicago'
union
select fs.source_airport as source_airport, fs.mid_airport as mid_airport_1, fs.dest_airport as mid_airport_2, a2.name as dest_airport, (fs.time + round(111.138 * sqrt(power(((a1.Latitude) - a2.latitude), 2) + power(((a1.Longitude) - a2.longitude), 2)) / 500, 1)) as time, fs.airlineid_1, fs.airlineid_2, routes.airlineid as airlineid_3
from from_source fs join airports a1 on a1.name = fs.dest_airport
join routes on routes.source_airportid = a1.airportid
join airports a2 on a2.airportid = routes.destination_airportid
where a2.city = 'New York'
order by time asc;

/* 
 query 4(complex): recommend user with 10 trips(city+restaurant) inside the united states such that
 1. all the 3 cities in the trip are popular cities(defined in the previous query)
 2. flights connecting the cities are all non-stop flights and the estimated flight time(based on distance) is less than 3 hours
 3. restaruants have the best total rating stars
 *NOTE: assume the trip is one-way trip instead of a round trip
 
 The return result is of the form
 (city1, restaurant1_name, restaurant1_address, restaurant1_stars, city2, restaurant2_name, restaurant2_address, restaurant2_stars, city3, restaurant3_name, restaurant3_address, restaurant3_stars)
 
 For example, this could be one recommendation:
 (Philly, Sangkee, address, 4.5)-->(Chicago, Sitar India, address, 5.0)-->(New York, Maggiano's Little Italy, address, 4.5)
 ...
 */
with popular_flight_city as (
    select
        ap.city as city,
        count(*) AS flt_cnt
    from
        Routes r
        join airports ap on r.destination_airportid = ap.airportid
    where
        ap.country = 'United States'
    group by
        ap.city
),
city_restaurants_cnt as (
    select
        city,
        count(restaurants.business_id) as rest_cnt
    from
        restaurants
        join restaurants_features on restaurants_features.business_id = restaurants.business_id
    where
        restaurants_features.stars > 3
    group by
        city
),
popular_city as(
    select
        pfc.city
    from
        popular_flight_city pfc
        join city_restaurants_cnt cr on pfc.city = cr.city
    where
        rownum < 10
    order by
        flt_cnt,
        rest_cnt DESC
),
two_popular_city as (
    select
        pc1.city as source_city,
        pc2.city as destination_city
    from
        popular_city pc1
        cross join popular_city pc2
        join airports ap1 on ap1.city = pc1.city
        join airports ap2 on ap2.city = pc2.city
        join routes on routes.source_airportid = ap1.airportid
        and routes.destination_airportid = ap2.airportid
    where
        pc1.city <> pc2.city
        and power(ap1.Latitude - ap2.Latitude, 2) + power(ap1.longitude - ap2.longitude, 2) < 100
),
three_popular_city as (
    select
        tpc1.source_city as city1,
        tpc1.destination_city as city2,
        tpc2.destination_city as city3
    from
        two_popular_city tpc1
        join two_popular_city tpc2 on tpc1.destination_city = tpc2.source_city
    where
        tpc1.source_city <> tpc2.destination_city
)
select
    city1 as city1,
    rest1.name as rest1,
    rest1.address as add1,
    rest1.stars as star1,
    city2 as city2,
    rest2.name as rest2,
    rest2.address as add2,
    rest2.stars as star2,
    city3 as city3,
    rest3.name as rest3,
    rest3.address as add3,
    rest3.stars as star3
from
    three_popular_city tpc
    join restaurants_full rest1 on tpc.city1 = rest1.city
    join restaurants_full rest2 on tpc.city2 = rest2.city
    join restaurants_full rest3 on tpc.city3 = rest3.city
where
    rest1.stars > 4
    and rest2.stars > 4
    and rest3.stars > 4
ORDER BY
    RAND() fetch next 10 rows only;

/* 
 query 5(complex): recommend several restaurants for three users from different cities to meet
 1. the three users spend roughly the same amount of time on the flight and the time is minimzed
 2. the meet city is a popular city(defined in the previous query)
 3. the cuisine of the restaurants should match at least one of the cuisines requested by users
 */
with popular_flight_city as (
    select
        ap.city as city,
        count(*) AS flt_cnt
    from
        Routes r
        join airports ap on r.destination_airportid = ap.airportid
    where
        ap.country = 'United States'
    group by
        ap.city
),
city_restaurants_cnt as (
    select
        city,
        count(restaurants.business_id) as rest_cnt
    from
        restaurants
        join restaurants_features on restaurants_features.business_id = restaurants.business_id
    where
        restaurants_features.stars > 3
    group by
        city
),
popular_city as(
    select
        pfc.city
    from
        popular_flight_city pfc
        join city_restaurants_cnt cr on pfc.city = cr.city
    order by
        flt_cnt,
        rest_cnt DESC fetch next 20 rows only
),
meet_city as(
    select
        ap4.city
    from
        airports ap1
        cross join airports ap2
        cross join airports ap3
        cross join airports ap4
        join routes r1 on r1.source_airportid = ap1.airportid
        and r1.destination_airportid = ap4.airportid
        join routes r2 on r2.source_airportid = ap2.airportid
        and r2.destination_airportid = ap4.airportid
        join routes r3 on r3.source_airportid = ap3.airportid
        and r3.destination_airportid = ap4.airportid
    where
        ap1.city = 'Chicago'
        and ap2.city = 'New York'
        and ap3.city = 'Boston'
        and ap4.city in (
            select
                *
            from
                popular_city
        )
        and rownum = 1
    order by
        (
            power((ap1.Latitude - ap4.Latitude), 2) + power((ap2.Latitude - ap4.Latitude), 2) + power((ap3.Latitude - ap4.Latitude), 2) + power((ap1.longitude - ap4.longitude), 2) + power((ap2.longitude - ap4.longitude), 2) + power((ap3.longitude - ap4.longitude), 2)
        ) DESC
)
select
    distinct mc.city,
    rest.name,
    rest.address,
    rest.stars
from
    meet_city mc
    join restaurants_full rest on rest.city = mc.city
where
    Upper(rest.categories) LIKE '%INDIAN,%'
    or Upper(rest.categories) LIKE '%CHINESE,%'
    or Upper(rest.categories) LIKE '%ITALIAN,%'
order by
    rest.stars DESC fetch next 10 rows only;