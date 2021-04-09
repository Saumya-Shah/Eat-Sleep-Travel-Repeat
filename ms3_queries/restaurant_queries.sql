/*
 Complex query: 
 Get top 5 rated restaurants' name, address, star rating, 
 number of reviews, parking availability, photos with captions 
 based on User selected city, and each of the type of cuisine.
 */
WITH city_restaurants AS (
       SELECT
              *
       FROM
              restaurants
       WHERE
              city = 'Las Vegas'
),
food_specific_indian AS (
       SELECT
              *
       FROM
              city_restaurants natural
              JOIN restaurants_features rf
       WHERE
              Upper(rf.categories) LIKE '%INDIAN,%'
              AND rf.covid = 'True'
       ORDER BY
              rf.stars desc,
              rf.review_count desc
       FETCH first
              5 ROWS only
),
food_specific_chinese AS (
       SELECT
              *
       FROM
              city_restaurants natural
              JOIN restaurants_features rf
       WHERE
              Upper(rf.categories) LIKE '%CHINESE,%'
              AND rf.covid = 'True'
       ORDER BY
              rf.stars desc,
              rf.review_count desc
       FETCH first
              5 ROWS only
),
food_specific_italian AS (
       SELECT
              *
       FROM
              city_restaurants natural
              JOIN restaurants_features rf
       WHERE
              Upper(rf.categories) LIKE '%ITALIAN,%'
              AND rf.covid = 'True'
       ORDER BY
              rf.stars desc,
              rf.review_count desc
       FETCH first
              5 ROWS only
),
final_table AS (
       SELECT
              food_specific_indian.*,
              'INDIAN' AS CUISINE
       FROM
              food_specific_indian
       UNION
       SELECT
              food_specific_italian.*,
              'ITALIAN' AS CUISINE
       FROM
              food_specific_italian
       UNION
       SELECT
              food_specific_chinese.*,
              'CHINESE' AS CUISINE
       FROM
              food_specific_chinese
),
output AS (
       SELECT
              *
       FROM
              final_table ft NATURAL
              JOIN restaurants_pics rp
)
SELECT
       name,
       address,
       city,
       state,
       postal_code,
       cuisine,
       stars,
       review_count,
       parking,
       photo_id,
       caption
FROM
       output
ORDER BY
       cuisine;

/*
 Complex query:
 Get top 10 closest restaurants in postal codes within 50 km radius from given latitude-logitude
 each with rating higher than average rating of restaurants in that postal code
 and the ones which are open on Monday during 3pm to 5pm interval.
 */
WITH distance_table AS (
       SELECT
              Round(
                     111.138 * Sqrt(
                            Power(((latitude) - 45.62), 2) + Power(((longitude) + 72.94), 2)
                     ),
                     4
              ) AS distance,
              business_id,
              postal_code
       FROM
              restaurants
),
features_joined AS (
       SELECT
              *
       FROM
              distance_table natural
              JOIN restaurants_features
),
grouped_postal_code AS (
       SELECT
              postal_code,
              Avg(stars) AS avg_rate
       FROM
              features_joined
       GROUP BY
              (postal_code)
),
grouped_area_features AS (
       SELECT
              *
       FROM
              grouped_postal_code natural
              JOIN features_joined
),
top_rating AS (
       SELECT
              *
       FROM
              grouped_area_features
       WHERE
              stars >= avg_rate
),
time_table AS (
       SELECT
              business_id
       FROM
              restaurants_time
       WHERE
              monday_start < '15:00'
              AND monday_end > '17:00'
),
final_table AS (
       SELECT
              *
       FROM
              time_table natural
              JOIN top_rating
)
SELECT
       *
FROM
       final_table natural
       JOIN restaurants
WHERE
       distance < 50
ORDER BY
       distance
FETCH first
       10 ROWS only;

/*
 Easy query:
 Find top 10 restaurants within 40km radius to user provided/ user geolocation 
 which are open on Monday at 3 pm.
 */
WITH distance_table AS (
       SELECT
              round(
                     111.138 * sqrt(
                            power(((Latitude) - 45.62), 2) + power(((Longitude) + 72.94), 2)
                     ),
                     4
              ) AS distance,
              business_id
       FROM
              Restaurants
),
distance_table_ordered AS (
       SELECT
              *
       FROM
              distance_table
       WHERE
              distance < 40
       ORDER BY
              distance
       FETCH FIRST
              100 ROWS ONLY
),
time_table AS (
       SELECT
              business_id
       FROM
              restaurants_time
       WHERE
              Monday_start < '15:00'
              AND Monday_end > '15:00'
),
final_table AS (
       SELECT
              *
       FROM
              time_table NATURAL
              JOIN distance_table_ordered
       FETCH FIRST
              10 ROWS ONLY
)
SELECT
       *
FROM
       final_table NATURAL
       JOIN restaurants
ORDER BY
       distance;

/*
 Easy query: 
 Get top 5 rated restaurants in each of the user requested cities (Review count is used to break ties)
 */
WITH restaurants_with_features as (
       SELECT
              *
       FROM
              restaurants natural
              JOIN restaurants_features
),
top_restaurants_in_calgary AS (
       SELECT
              *
       FROM
              restaurants_with_features
       WHERE
              city = 'Calgary'
       ORDER BY
              stars desc,
              review_count desc
       FETCH FIRST
              5 ROWS ONLY
),
top_restaurants_in_lv AS (
       SELECT
              *
       FROM
              restaurants_with_features
       WHERE
              city = 'Las Vegas'
       ORDER BY
              stars desc,
              review_count desc
       FETCH FIRST
              5 ROWS ONLY
),
top_restaurants_in_pittsburgh AS (
       SELECT
              *
       FROM
              restaurants_with_features
       WHERE
              city = 'Pittsburgh'
       ORDER BY
              stars desc,
              review_count desc
       FETCH FIRST
              5 ROWS ONLY
)
SELECT
       *
FROM
       (
              SELECT
                     *
              FROM
                     top_restaurants_in_calgary
       )
UNION
(
       SELECT
              *
       FROM
              top_restaurants_in_lv
)
UNION
(
       SELECT
              *
       FROM
              top_restaurants_in_pittsburgh
);

/*
 Easy query:
 Get restaurants in Las Vegas which serve Chinese or Indian with rating more than 4 and 
 have more than 500 reviews and have Parking facility and are open on Monday at 8pm
 */
WITH restaurants_with_features_and_time AS (
       SELECT
              *
       FROM
              restaurants natural
              JOIN restaurants_features natural
              join restaurants_time
),
top_restaurants_in_las_vegas AS (
       SELECT
              *
       FROM
              restaurants_with_features_and_time
       WHERE
              city = 'Las Vegas'
              AND review_count > 500
              AND Monday_start < '15:00'
              AND Monday_end > '15:00'
              AND parking = 'True'
              AND stars > '4'
       ORDER BY
              stars DESC,
              review_count DESC
)
SELECT
       *
from
       top_restaurants_in_las_vegas;