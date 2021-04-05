
---popular city(most number of destination in routes) ranking by number of restaurants whose stars are above 3 in United States
with popular_city as (select ap.city as city, count(*) AS flt_cnt 
from Routes r, airports ap
where r.destination_airportid=ap.airportid and ap.country='United States'
group by ap.city),
city_restaurants_cnt as (
    select city, count(restaurants.business_id) as rest_cnt
    from restaurants 
    join restaurants_features on restaurants_features.business_id = restaurants.business_id
    where restaurants_features.stars > 3
    group by city
)
select pc.city
from popular_city pc join city_restaurants_cnt cr
on pc.city = cr.city
order by flt_cnt,rest_cnt DESC 
fetch next 20 rows only;


---unpopular city (least number of destination in routes)
select ap.city, count(*)
from Routes r, airports ap
where r.destination_airportid=ap.airportid
group by ap.city
order by count(r.destination_airportid) ASC
fetch next 10 rows only
;

