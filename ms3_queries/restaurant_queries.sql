 WITH city_restaurants
     AS (SELECT *
         FROM   restaurants
         WHERE  city = 'Las Vegas'),
     food_specific
     AS (SELECT *
         FROM   city_restaurants
                natural JOIN restaurants_features rf
         WHERE  Upper(rf.categories) LIKE '%CHINESE,%'
                AND rf.covid = 'True'),
     final_table
     AS (SELECT *
         FROM   food_specific
         ORDER  BY stars desc,
                   review_count desc
         FETCH first 10 ROWS only)
SELECT *
FROM   final_table
       natural JOIN restaurants_pics rp;  




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