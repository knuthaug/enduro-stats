#!/bin/bash

# EQ results
node import/importer.js -a ~/Dropbox/privat/sykkel/enduro-resultater/2012/kongsberg/ #ok
node import/importer.js -a ~/Dropbox/privat/sykkel/enduro-resultater/2013/nesbyen/ #ok
node import/importer.js ~/Dropbox/privat/sykkel/enduro-resultater/2014/nesbyen/ #not ok
node import/importer.js ~/Dropbox/privat/sykkel/enduro-resultater/2015/luster/ #not ok
node import/importer.js ~/Dropbox/privat/sykkel/enduro-resultater/2015/nesbyen/ #not ok
node import/importer.js -a ~/Dropbox/privat/sykkel/enduro-resultater/2015/oppdal/ #not ok
node import/importer.js -a ~/Dropbox/privat/sykkel/enduro-resultater/2015/oslo/ # not ok
node import/importer.js -a ~/Dropbox/privat/sykkel/enduro-resultater/2015/traktor/ #not ok
