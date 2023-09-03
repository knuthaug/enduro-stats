select id, race_id, 
(select name from races where race_id = id) as race_name, 
(select year from races where race_id = id) as race_year, 
class, final_rank, status,
/*(SELECT series from races where id = race_id) as series, */
(SELECT name FROM riders where id = results.rider_id) as name 
from results where race_id in 
  (select id from races where races.year = 2022) 
  AND final_rank IS NOT NULL AND 
  (SELECT uid FROM riders where id = results.rider_id) in ('c250595d8c9f7648510eaa02f226ef6e', '96f3cf4260149020624791b911d28aee')
  order by name, race_year, class, final_rank


/*select distinct race_id, rider_id, class, final_rank from results where results.race_id > 84 and results.class like '%13-14%' OR results.class like '%15-16%'*/

select distinct results.rider_id, (select name from riders where id = results.rider_id) as name, races.id, races.name, races.year from results LEFT OUTER JOIN rider_races on results.rider_id = rider_races.rider_id LEFT OUTER JOIN races on rider_races.race_id = races.id where races.id > 83 order by races.id;

select distinct results.rider_id, (select name from riders where id = results.rider_id) as name, results.class, results.final_rank as plassering, races.id, races.name, races.year from results LEFT OUTER JOIN rider_races on results.rider_id = rider_races.rider_id LEFT OUTER JOIN races on rider_races.race_id = races.id where races.id > 83 and results.class like '%15-17%' and results.final_rank IS NOT NULL order by races.id, results.final_rank;

/* ser bra ut */
select distinct results.rider_id, (select name from riders where id = results.rider_id) as name, (select club from riders where id = results.rider_id) as club, results.class, results.final_rank as plassering, races.id, races.name, races.year from results LEFT OUTER JOIN races on results.race_id = races.id where races.id > 83 and results.final_rank IS NOT NULL and (results.class like '%15-17%' or results.class like '%15-16%' or class like '%13-14%') order by races.id, class, final_rank;
