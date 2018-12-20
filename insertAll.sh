#!/bin/bash

# EQ results
#2012
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2012/kongsberg/kongsberg-2012.csv #ok!
node import/importer.js  -f ~/Dropbox/privat/sykkel/enduro-resultater/2012/nesbyen/nesbyen-2012.csv #ok!
node import/importer.js  -f ~/Dropbox/privat/sykkel/enduro-resultater/2012/oslo/oslo-2012.csv #ok!

#2013
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2013/nesbyen/nesbyen-2013.csv #ok!
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2013/oslo/oslo-2013.csv # ok!

#2014
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/drammen/drammen-2014.csv # ok
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/oslo/oslo-2014.csv # ok
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/traktor/traktor-2014.csv # ok
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/nesbyen/nesbyen-2014.csv # ok
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/sogndal/sogndal-2014.csv # ok

#2015
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/nesbyen/nesbyen-2015.csv # ok
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/luster/luster-2015.csv # ok
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/oppdal/oppdal-2015.csv #ok!
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/oslo/oslo-2015.csv # ok!
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/traktor/traktor-2015.csv # ok!
node import/importer.js  -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/frei/frei-2015.csv # ok!

#2016
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2016/hafjell/hafjell-2016.csv # ok!
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2016/oppdal/oppdal-2016.csv # ok!
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2016/traktor/traktor-2016.csv # ok!
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2016/voss/voss-2016.csv # not ok!


