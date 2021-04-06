create materialized view restaurants_full (business_id, name, address, city, stars, categories) as 
select r.business_id, r.name, r.address, r.city, rf.stars, rf.categories 
from restaurants r join restaurants_features rf
on r.business_id = rf.business_id;
/* 
TODO:
easy query: find all cities(in the united states) that are within 3-hour flight distance to user's location and the flight is non-stop or one-stop
*/

/* 
TODO:
easy query: find all flights that meets the user defined search attributes
1. source city
2. destination city
3. non-stop, one-stop or two-stop
4. no traveling outside of the original country
*/

/* 
easy query: recommend user with 10 cities to travel to in the united states
popular city defination: the city that appears as "destination" in routes table most frequently and has most restaurants with star>3
*/
with popular_flight_city as (
    select ap.city as city, count(*) AS flt_cnt 
    from Routes r join airports ap on r.destination_airportid=ap.airportid 
    where ap.country='United States'
    group by ap.city),
city_restaurants_cnt as (
    select city, count(restaurants.business_id) as rest_cnt
    from restaurants 
    join restaurants_features on restaurants_features.business_id = restaurants.business_id
    where restaurants_features.stars > 3
    group by city)
select pfc.city
from popular_flight_city pfc join city_restaurants_cnt cr on pfc.city = cr.city
order by flt_cnt,rest_cnt DESC 
fetch next 10 rows only;

/* 
complex query: recommend user with 5 trips(city+restaurant) inside the united states such that
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
    select ap.city as city, count(*) AS flt_cnt 
    from Routes r join airports ap on r.destination_airportid=ap.airportid 
    where ap.country='United States'
    group by ap.city),
city_restaurants_cnt as (
    select city, count(restaurants.business_id) as rest_cnt
    from restaurants 
    join restaurants_features on restaurants_features.business_id = restaurants.business_id
    where restaurants_features.stars > 3
    group by city),
popular_city as(
    select pfc.city
    from popular_flight_city pfc 
    join city_restaurants_cnt cr on pfc.city = cr.city
    where rownum < 10
    order by flt_cnt,rest_cnt DESC ),
two_popular_city as (
    select pc1.city as source_city, pc2.city as destination_city
    from popular_city pc1 
    cross join popular_city pc2 
    join airports ap1 on ap1.city = pc1.city
    join airports ap2 on ap2.city = pc2.city
    join routes on routes.source_airportid = ap1.airportid and routes.destination_airportid = ap2.airportid
    where pc1.city<>pc2.city and power(ap1.Latitude - ap2.Latitude, 2) + power(ap1.longitude - ap2.longitude, 2) < 100),
three_popular_city as (
    select tpc1.source_city as city1, tpc1.destination_city as city2, tpc2.destination_city as city3
    from two_popular_city tpc1 join two_popular_city tpc2
    on tpc1.destination_city = tpc2.source_city
    where tpc1.source_city <> tpc2.destination_city)
select city1, rest1.name, rest1.address, rest1.stars, city2, rest2.name, rest2.address, rest2.stars, city3, rest3.name, rest3.address, rest3.stars
from three_popular_city tpc 
join restaurants_full rest1 on tpc.city1 = rest1.city
join restaurants_full rest2 on tpc.city2 = rest2.city
join restaurants_full rest3 on tpc.city3 = rest3.city
where rest1.stars > 4 and rest2.stars > 4 and rest3.stars > 4
ORDER BY RAND()
fetch next 10 rows only;

/* 
complex query: recommend several restaurants for three users from different cities to meet
1. the three users spend roughly the same amount of time on the flight and the time is minimzed
2. the meet city is a popular city(defined in the previous query)
3. the cuisine of the restaurants should match at least one of the cuisines requested by users
*/
with popular_flight_city as (  
    select ap.city as city, count(*) AS flt_cnt 
    from Routes r join airports ap on r.destination_airportid=ap.airportid 
    where ap.country='United States'
    group by ap.city),
city_restaurants_cnt as (
    select city, count(restaurants.business_id) as rest_cnt
    from restaurants 
    join restaurants_features on restaurants_features.business_id = restaurants.business_id
    where restaurants_features.stars > 3
    group by city),
popular_city as(
    select pfc.city
    from popular_flight_city pfc join city_restaurants_cnt cr on pfc.city = cr.city
    order by flt_cnt,rest_cnt DESC 
    fetch next 20 rows only),
meet_city as(
    select ap4.city
    from airports ap1
    cross join airports ap2
    cross join airports ap3
    cross join airports ap4
    join routes r1 on r1.source_airportid = ap1.airportid and r1.destination_airportid = ap4.airportid
    join routes r2 on r2.source_airportid = ap2.airportid and r2.destination_airportid = ap4.airportid
    join routes r3 on r3.source_airportid = ap3.airportid and r3.destination_airportid = ap4.airportid
    where ap1.city = 'Chicago' and ap2.city='New York' and ap3.city = 'Boston' and ap4.city in (select * from popular_city) and rownum=1
    order by (power((ap1.Latitude-ap4.Latitude),2)+ power((ap2.Latitude-ap4.Latitude),2)+ power((ap3.Latitude-ap4.Latitude),2)+ power((ap1.longitude-ap4.longitude),2)+ power((ap2.longitude-ap4.longitude),2)+ power((ap3.longitude-ap4.longitude),2)) DESC)
select distinct mc.city, rest.name, rest.address, rest.stars
from meet_city mc
join restaurants_full rest on rest.city = mc.city
where Upper(rest.categories) LIKE '%INDIAN,%' or Upper(rest.categories) LIKE '%CHINESE,%' or Upper(rest.categories) LIKE '%ITALIAN,%'
order by rest.stars DESC
fetch next 10 rows only;

    

