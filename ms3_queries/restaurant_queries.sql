-- Selects top 5 rated Indian, Chinese, Italian restaurants in Las Vegas
 WITH city_restaurants
     AS (SELECT *
         FROM   restaurants
         WHERE  city = 'Las Vegas'),
     food_specific_indian
     AS (SELECT *
         FROM   city_restaurants
                natural JOIN restaurants_features rf
         WHERE  Upper(rf.categories) LIKE '%INDIAN,%'
                AND rf.covid = 'True' 
         ORDER  BY rf.stars desc,
                   rf.review_count desc
         FETCH first 5 ROWS only),
    food_specific_chinese
     AS (SELECT *
         FROM   city_restaurants
                natural JOIN restaurants_features rf
         WHERE  Upper(rf.categories) LIKE '%CHINESE,%'
                AND rf.covid = 'True' 
         ORDER  BY rf.stars desc,
                   rf.review_count desc
         FETCH first 5 ROWS only),
    food_specific_italian
     AS (SELECT * 
         FROM   city_restaurants
                natural JOIN restaurants_features rf
         WHERE  Upper(rf.categories) LIKE '%ITALIAN,%'
                AND rf.covid = 'True' 
         ORDER  BY rf.stars desc,
                   rf.review_count desc
         FETCH first 5 ROWS only),
     final_table
     AS (SELECT food_specific_indian.*, 'INDIAN' AS CUISINE
         FROM   food_specific_indian 
         UNION 
         SELECT food_specific_italian.*, 'ITALIAN' AS CUISINE
         FROM food_specific_italian 
         UNION 
         SELECT food_specific_chinese.*, 'CHINESE' AS CUISINE
         FROM food_specific_chinese         
         ),
    output 
    AS (SELECT *
       FROM final_table ft
       NATURAL JOIN restaurants_pics rp)
SELECT name, address, city, state, postal_code, cuisine, stars, review_count, parking, photo_id, caption
FROM   output order by cuisine;


WITH distance_table AS
  (SELECT round(111.138* sqrt(power(((Latitude) - 45.62),2) + power(((Longitude) + 72.94),2)), 4) AS distance,
          business_id
   FROM Restaurants),
     distance_table_ordered AS
  (SELECT *
   FROM distance_table
   ORDER BY distance FETCH FIRST 100 ROWS ONLY),
     time_table AS
  (SELECT business_id
   FROM restaurants_time
   WHERE Monday_start<'15:00'
     AND Monday_end>'15:00'),
     final_table AS
  (SELECT *
   FROM time_table
   NATURAL JOIN distance_table_ordered FETCH FIRST 10 ROWS ONLY)
SELECT *
FROM final_table
NATURAL JOIN restaurants
ORDER BY distance;



 WITH distance_table
     AS (SELECT Round(111.138 * Sqrt(Power(((latitude) - 45.62), 2)
                                     + Power(((longitude) + 72.94), 2)), 4) AS
                distance,
                business_id,
                postal_code
         FROM   restaurants),
     features_joined
     AS (SELECT *
         FROM   distance_table
                natural JOIN restaurants_features),
     grouped_postal_code
     AS (SELECT postal_code,
                Avg(stars) AS avg_rate
         FROM   features_joined
         GROUP  BY ( postal_code )),
     grouped_area_features
     AS (SELECT *
         FROM   grouped_postal_code
                natural JOIN features_joined),
     top_rating
     AS (SELECT *
         FROM   grouped_area_features
         WHERE  stars >= avg_rate),
     time_table
     AS (SELECT business_id
         FROM   restaurants_time
         WHERE  monday_start < '15:00'
                AND monday_end > '15:00'),
     final_table
     AS (SELECT *
         FROM   time_table
                natural JOIN top_rating)
SELECT *
FROM   final_table
       natural JOIN restaurants
WHERE  distance < 50
ORDER  BY distance
FETCH first 10 ROWS only;  


 WITH distance_table
     AS (SELECT Round(111.138 * Sqrt(Power(((latitude) - 45.62), 2)
                                     + Power(((longitude) + 72.94), 2)), 4) AS
                distance,
                business_id
         FROM   restaurants),
     distance_table_top
     AS (SELECT *
         FROM   distance_table
         WHERE  distance < 5)
SELECT *
FROM   distance_table_top
       natural JOIN restaurants
ORDER  BY distance
FETCH first 50 ROWS only;  