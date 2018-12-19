#!/bin/bash

# EQ results
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2012/kongsberg/kongsberg-2012.csv #ok!
node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2013/nesbyen/nesbyen-2013.csv #ok!
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2013/oslo/oslo-2013.csv # ok!

node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/drammen/drammen-2014.csv # ok
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/oslo/oslo-2014.csv # ok
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/traktor/traktor-2014.csv # ok
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/nesbyen/nesbyen-2014.csv # ok
node import/importer.js -f ~/Dropbox/privat/sykkel/enduro-resultater/2014/sogndal/sogndal-2014.csv # ok

node import/importer.js -a -f ~/Dropbox/privat/sykkel/enduro-resultater/2015/nesbyen/nesbyen-2015.csv # ok

#node import/importer.js -d ~/Dropbox/privat/sykkel/enduro-resultater/2015/luster/ #not ok
#node import/importer.js -a -d ~/Dropbox/privat/sykkel/enduro-resultater/2015/oppdal/ #ok!
#node import/importer.js -a -d ~/Dropbox/privat/sykkel/enduro-resultater/2015/oslo/ # ok!
#node import/importer.js -a -d ~/Dropbox/privat/sykkel/enduro-resultater/2015/traktor/ # ok!

#node import/importer.js -a -d ~/Dropbox/privat/sykkel/enduro-resultater/2016/hafjell # ok!
#node import/importer.js -a -d ~/Dropbox/privat/sykkel/enduro-resultater/2016/oppdal # ok!
#node import/importer.js -a -d ~/Dropbox/privat/sykkel/enduro-resultater/2016/traktor # ok!
#node import/importer.js -a -d ~/Dropbox/privat/sykkel/enduro-resultater/2016/voss # ok!


