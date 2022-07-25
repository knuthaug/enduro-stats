#!/bin/bash


# EQ results
#2012
echo "2012:"
echo "  Nesbyen I"
node import/importer.js -m -f results/2012/nesbyen-I/nesbyen-2012-I.csv
echo "  Oslo"
node import/importer.js -f results/2012/oslo/oslo-2012.csv
echo "  Nesbyen"
node import/importer.js -f results/2012/nesbyen-II/nesbyen-2012.csv
echo "  Kongsberg"
node import/importer.js -a -f results/2012/kongsberg/kongsberg-2012.csv


#2013
echo "2013:"
echo "  Nesbyen"
node import/importer.js -a -f results/2013/nesbyen/nesbyen-2013.csv
echo "  Traktor"
node import/importer.js -r results/2013/traktor/racedata.json
echo "  Oslo"
node import/importer.js -f results/2013/oslo/oslo-2013.csv
echo "  Sogndal"
node import/importer.js -f results/2013/sogndal/sogndal-2013.csv
echo "  Kongsberg"
node import/importer.js -r results/2013/kongsberg/racedata.json


#2014
echo "2014:"
echo "  Oslo"
node import/importer.js -f results/2014/oslo/oslo-2014.csv
echo "  Traktor"
node import/importer.js -f results/2014/traktor/traktor-2014.csv
echo "  Nesbyen"
node import/importer.js -f results/2014/nesbyen/nesbyen-2014.csv
echo "  Sogndal"
node import/importer.js -f results/2014/sogndal/sogndal-2014.csv
echo "  Drammen"
node import/importer.js -f results/2014/drammen/drammen-2014.csv
echo "  Molde"
node import/importer.js -f results/2014/molde/molde-2014.csv
echo "  Frei"
node import/importer.js -r results/2014/frei/racedata.json
echo "  Hillbilly"
node import/importer.js -f results/2014/hillbilly/hillbilly-2014.csv

#2015
echo "2015:"
echo "  Nesbyen"
node import/importer.js -a -f results/2015/nesbyen/nesbyen-2015.csv
echo "  Voss"
node import/importer.js -m -f results/2015/voss/voss-2015.csv
echo "  Luster"
node import/importer.js -a -f results/2015/luster/luster-2015.csv
echo "  Traktor"
node import/importer.js -a -f results/2015/traktor/traktor-2015.csv
echo "  Frei"
node import/importer.js -f results/2015/frei/frei-2015.csv
echo "  Hillbilly"
node import/importer.js -f results/2015/hillbilly/hillbilly-2015.csv
echo "  Oslo"
node import/importer.js -a -f results/2015/oslo/oslo-2015.csv
echo "  Oppdal"
node import/importer.js -a -f results/2015/oppdal/oppdal-2015.csv
echo "  Molde"
#node import/importer.js -r results/2015/molde/racedata.json
node import/importer.js -m -f results/2015/molde/molde-2015.csv


#2016
echo "2016:"
echo "  Nesbyen"
node import/importer.js -m -f results/2016/nesbyen/nesbyen-2016.csv
echo "  Traktor"
node import/importer.js -a -f results/2016/traktor/traktor-2016.csv
echo "  Voss"
node import/importer.js -a -f results/2016/voss/voss-2016.csv
echo "  Oppdal"
node import/importer.js -a -f results/2016/oppdal/oppdal-2016.csv
echo "  Frei"
node import/importer.js -r results/2016/frei/racedata.json
echo "  Hafjell"
node import/importer.js -a -f results/2016/hafjell/hafjell-2016.csv
echo "  Hemsedal"
node import/importer.js -f results/2016/hemsedal/hemsedal-2016.csv



echo "2017:"
echo "  Telemark"
node import/importer.js -r results/2017/skien/racedata.json
echo "  Nesbyen"
node import/importer.js -f results/2017/nesbyen/nesbyen-2017.csv
echo "  Bodø"
node import/importer.js -m -f results/2017/bodø/bodø-2017.csv
echo "  Voss"
node import/importer.js -m -f results/2017/voss/voss-2017-2.csv
echo "  Drammen"
node import/importer.js -m -f results/2017/drammen/drammen-2017.csv
echo "  Traktor"
node import/importer.js -m -f results/2017/traktor/traktor-2017.csv
echo "  Hafjell"
node import/importer.js -m -f results/2017/hafjell/hafjell-2017.csv
echo "  Frei"
node import/importer.js -f results/2017/frei/frei-2017.csv
echo "  Hakadal"
node import/importer.js -m -f results/2017/hakadal/hakadal-2017.csv
echo "  Hemsedal"
node import/importer.js -f results/2017/hemsedal/hemsedal-2017.csv
echo "  Ringerike"
node import/importer.js -m -f results/2017/ringerike/ringerike-2017.csv


echo "2018:"
echo "  Telemark"
node import/importer.js -m -f results/2018/skien/telemark-2018.csv
echo "  Nesbyen"
node import/importer.js -m -f results/2018/nesbyen/nesbyen-2018.csv
echo "  Bodø"
node import/importer.js -m -f results/2018/bodø/bodø-2018.csv
echo "  Voss"
node import/importer.js -m -f results/2018/voss/voss-2018.csv
echo "  Frei"
node import/importer.js -f results/2018/frei/frei-2018.csv
echo "  Drammen"
node import/importer.js -m -f results/2018/drammen/drammen-2018.csv
echo "  Oslo"
node import/importer.js -m -f results/2018/oslo/oslo-2018.csv
echo "  Nesfjella"
node import/importer.js -m -f results/2018/nesfjella/nesfjella-2018.csv
echo "  Hafjell"
node import/importer.js -m -f results/2018/hafjell/hafjell-2018.csv
echo "  Harstad"
node import/importer.js -f results/2018/harstad/harstad-2018.csv
echo "  Hakadal"
node import/importer.js -m -f results/2018/hakadal/hakadal-2018.csv
echo "  Hemsedal"
node import/importer.js -m -f results/2018/hemsedal/hemsedal-2018.csv
echo "  Ringerike"
node import/importer.js -m -f results/2018/ringerike/ringerike-2018.csv

echo "2019"
echo "  Hakadal Snowhill"
node import/importer.js -m -f results/2019/hakadal-snowhill/hakadal-snowhill-2019.csv
echo "  Telemark"
node import/importer.js -s -f results/2019/telemark/telemark-2019-original.csv
echo "  Molde"
node import/importer.js -m -f results/2019/molde/molde-2019.csv
echo "  Bodø"
node import/importer.js -m -f results/2019/bodø/bodø-2019.csv
echo "  Traktorland"
node import/importer.js -m -f results/2019/traktorland/traktorland-2019.csv
echo "  Voss"
node import/importer.js -m -f results/2019/voss/voss-2019.csv
echo "  Drammen"
node import/importer.js -m -f results/2019/drammen/drammen-2019.csv
echo "  Beitostølen"
node import/importer.js -m -f results/2019/beito/beito-2019.csv
echo "  Oslo"
node import/importer.js -m -f results/2019/oslo/oslo-2019.csv
echo "  Harstad"
node import/importer.js -f results/2019/harstad/harstad-2019.csv
echo "  Hakadal"
node import/importer.js -s -f results/2019/hakadal/hakadal-2019.csv
echo "  Nesbyen"
node import/importer.js -m -f results/2019/nesbyen/nesbyen-2019.csv
echo "  Hemsedal"
node import/importer.js -m -f results/2019/hemsedal/hemsedal-2019.csv
echo "  Trysil"
node import/importer.js -m -f results/2019/trysil/trysil-2019.csv
echo "  Ringerike"
node import/importer.js -m -f results/2019/ringerike/ringerike-2019.csv

echo "2020"
echo "  Nittedal ungdomsenduro"
node import/importer.js -m -f results/2020/nittedal/nittedal-2020.csv
echo "  Trysil Enduro"
node import/importer.js -m -f results/2020/trysil/trysil-2020.csv
echo "  Drammenduro"
node import/importer.js -m -f results/2020/drammen/drammen-2020.csv

echo "2021"
echo "  Ekstremsportveko enduro"
node import/importer.js -m -f results/2021/voss/voss-2021.csv

echo "  Drammen"
node import/importer.js -m -f results/2021/drammen/drammen-2021.csv

echo "  Traktorland"
node import/importer.js -m -f results/2021/traktorland/traktorland-2021.csv

echo "  Harstad"
node import/importer.js -f results/2021/harstad/harstad-2021.csv

echo "  Nesbyen"
node import/importer.js -m -f results/2021/nesbyen/nesbyen-2021.csv

echo "  Nittedal"
node import/importer.js -m -f results/2021/nittedal/nittedal-2021.csv

echo "  Spikkestad"
node import/importer.js -a -f results/2021/spikkestad/spikkestad-2021.csv

echo "  Trysil Enduro"
node import/importer.js -m -f results/2021/trysil/trysil-2021.csv


echo "2022"
echo "  Telemark Enduro"
node import/importer.js -m -f results/2022/telemark/telemark-2022.csv

echo "  Nesbyen Enduro"
node import/importer.js -m -f results/2022/nesbyen/nesbyen-2022.csv

echo "  Drammenduro"
node import/importer.js -m -f results/2022/drammen/drammen-2022.csv

echo "  Veko"
node import/importer.js -m -f results/2022/veko/veko-2022.csv

psql -U endurostats endurostats < scripts/byline.sql

