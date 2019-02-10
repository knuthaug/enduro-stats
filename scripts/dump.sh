#!/bin/sh

pg_dump -T raw_results -T raw_results_id_seq -O endurostats > dump.sql
