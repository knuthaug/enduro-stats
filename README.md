# enduro-stats

This is the repository for the site http://norskenduro.no, which displays results for norwegian mountainbike enduro races from the early start in 2012 and up to current year.

## Tech

Both the import system and the web server is written using node.js (12). Server uses fastify as the server, handlebars templates and misc. dependencies. It relies heavily on highcharts for visualizing the results of the races and riders.

Import supports the following result formats:

- eq timing multiple files
- eq timing single file
- sportident (json and ews excel format)
- mylaps

## Dev

```
npm install
npm test
npm test:integration
npm run dev
```

## Build

Build is set up with github actions. Deploy is manual for now

## Setup db

```
db-migrate up
```
