#!/bin/bash

# EQ results
#2012
echo "2012:"
echo "  Kongsberg"
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2012/kongsberg/kongsberg-2012.csv
echo "  Nesbyen"
node import/importer.js  -f ~/Dropbox/privat/sykkel/enduro-resultater/2012/nesbyen/nesbyen-2012.csv
echo "  Oslo"
node import/importer.js  -f ~/Dropbox/privat/sykkel/enduro-resultater/2012/oslo/oslo-2012.csv

#2013
echo "2013:"
echo "  Nesbyen"
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2013/nesbyen/nesbyen-2013.csv
echo "  Oslo"
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2013/oslo/oslo-2013.csv
echo "  Sogndal"
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2013/sogndal/sogndal-2013.csv
echo "  Kongsberg"
node import/importer.js -r ~/Dropbox/privat/sykkel/enduro-resultater/2013/kongsberg/racedata.json
echo "  Traktor"
node import/importer.js -r ~/Dropbox/privat/sykkel/enduro-resultater/2013/traktor/racedata.json

#2014
echo "2014:"
echo "  Drammen"
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/drammen/drammen-2014.csv
echo "  Oslo"
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/oslo/oslo-2014.csv
echo "  Traktor"
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/traktor/traktor-2014.csv
echo "  Nesbyen"
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/nesbyen/nesbyen-2014.csv
echo "  Sogndal"
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/sogndal/sogndal-2014.csv
echo "  Molde"
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/molde/molde-2014.csv
echo "  Frei"
node import/importer.js -r ~/Dropbox/privat/sykkel/enduro-resultater/2014/frei/racedata.json

#2015
echo "2015:"
echo "  Nesbyen"
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/nesbyen/nesbyen-2015.csv
echo "  Luster"
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/luster/luster-2015.csv
echo "  Oppdal"
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/oppdal/oppdal-2015.csv
echo "  Oslo"
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/oslo/oslo-2015.csv
echo "  Traktor"
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/traktor/traktor-2015.csv
echo "  Frei"
node import/importer.js  -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/frei/frei-2015.csv
echo "  Molde"
node import/importer.js -r ~/Dropbox/privat/sykkel/enduro-resultater/2015/molde/racedata.json

#2016
echo "2016:"
echo "  Hafjell"
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2016/hafjell/hafjell-2016.csv
echo "  Oppdal"
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2016/oppdal/oppdal-2016.csv
echo "  Traktor"
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2016/traktor/traktor-2016.csv
echo "  Voss"
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2016/voss/voss-2016.csv
echo "  Hemsedal"
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2016/hemsedal/hemsedal-2016.csv
echo "  Frei"
node import/importer.js -r ~/Dropbox/privat/sykkel/enduro-resultater/2016/frei/racedata.json
echo "  Nesbyen"
node import/importer.js -r ~/Dropbox/privat/sykkel/enduro-resultater/2016/nesbyen/racedata.json

echo "2017:"
echo "  Hemsedal"
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2017/hemsedal/hemsedal-2017.csv
echo "  Frei"
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2017/frei/frei-2017.csv
