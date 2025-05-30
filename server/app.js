const Fastify = require("fastify");
const fastifyStatic = require("@fastify/static");
const compression = require("@fastify/compress");
const pointOfView = require("@fastify/view");
const formbody = require("@fastify/formbody");
const handlebars = require("handlebars");
const config = require("../config");
const path = require("path");
const Db = require("./db");
const handlers = require("./handlers");
const helpers = require("./helpers");

const DEFAULT_CACHE_TIME_PAGES = 5000;
const ASSET_LONG_CACHE_TIME = 400000;
const ASSET_SHORT_CACHE_TIME = 7000;
const NOT_FOUND_CACHE_TIME = 60;

const shouldLog = config.get("env") !== "test";
const db = new Db();

const app = Fastify({
  logger: shouldLog,
});

handlebars.registerHelper("hashedAssets", helpers.hashedAssets);
handlebars.registerHelper("compare", helpers.compare);
handlebars.registerHelper("cat", helpers.cat);
handlebars.registerHelper("propFor", helpers.propFor);
handlebars.registerHelper("isDNF", helpers.isDNF);
handlebars.registerHelper("isDNS", helpers.isDNS);
handlebars.registerHelper("isDSQ", helpers.isDSQ);
handlebars.registerHelper("isError", helpers.isError);
handlebars.registerHelper("isOK", helpers.isOK);
handlebars.registerHelper("title", helpers.title);
handlebars.registerHelper("anchor", helpers.anchor);
handlebars.registerHelper("formatPercent", helpers.formatPercent);
handlebars.registerHelper("inc", helpers.inc);

app.register(fastifyStatic, {
  root: path.join(__dirname, "dist"),
});

app.register(compression);
app.register(formbody);
app.register(pointOfView, {
  engine: {
    handlebars: handlebars,
  },
  templates: "views",
  layout: "../views/layouts/main.hbs",
  options: {
    partials: {
      icon: "partials/icon.hbs",
      "rider-bio": "partials/rider-bio.hbs",
      "rider-graph": "partials/rider-graph.hbs",
      series: "partials/series.hbs",
      stagetime: "partials/stagetime.hbs",
    },
  },
});

app.get("/", handler("index.hbs", handlers.indexHandler, 2000));
app.get("/site.webmanifest", jsonHandler(handlers.manifestHandler));
app.get("/ritt", handler("races.hbs", handlers.racesHandler));
app.get(
  "/ritt/:uid",
  handler("race.hbs", handlers.raceHandler, DEFAULT_CACHE_TIME_PAGES),
);
app.get(
  "/ritt/:uid/full",
  handler("fullrace.hbs", handlers.fullRaceHandler, DEFAULT_CACHE_TIME_PAGES),
);
app.get("/serie/:uid", handler("series.hbs", handlers.seriesHandler));
app.get(
  "/om",
  handler("about.hbs", () => {
    return { status: 200, active: "om", title: "Om norsk enduro" };
  }),
);
app.get("/rytter/:uid", handler("rider.hbs", handlers.riderHandler));
app.get("/ryttere", handler("riders.hbs", handlers.ridersHandler));
app.get("/sammenlign", handler("compare.hbs", handlers.compareHandler));
app.get("/kart/:uid", handler("map.hbs", handlers.mapHandler));
app.get("/api/search", jsonHandler(handlers.jsonSearchHandler));
app.get("/api/graph/compare", jsonHandler(handlers.compareGraphHandler));
app.get("/api/graph/rider/:uid", jsonHandler(handlers.riderGraphHandler));
app.get("/api/series/rider/:uid", jsonHandler(handlers.riderSeriesHandler));
app.get("/kalender", handler("cal.hbs", handlers.calendarHandler));
app.get("/endringer", handler("changelog.hbs", handlers.changelogHandler));
app.get("/kalender/:year", dynamicHandler(handlers.calendarHandler));
app.get("/artikler/:id", handler("article.hbs", handlers.articleHandler));
app.post("/sok/", handler("search.hbs", handlers.searchHandler, 100));

app.get("/img/:file", (req, res) => {
  const file = req.params.file;
  return res
    .header("Cache-Control", `public, max-age=${ASSET_LONG_CACHE_TIME}`)
    .sendFile(`img/${file}`);
});

app.get("/assets/js/:file", (req, res) => {
  const file = req.params.file;

  if (
    /bundle/.test(file) ||
    /race/.test(file) ||
    /rider/.test(file) ||
    /compare/.test(file)
  ) {
    return res
      .header("Cache-Control", `public, max-age=${ASSET_LONG_CACHE_TIME}`)
      .sendFile(`js/${file}`);
  }

  return res
    .header("Cache-Control", `public, max-age=${ASSET_SHORT_CACHE_TIME}`)
    .sendFile(`js/${file}`);
});

app.get("/assets/img/:file", (req, res) => {
  const file = req.params.file;

  return res
    .header("Cache-Control", `public, max-age=${ASSET_LONG_CACHE_TIME}`)
    .sendFile(`img/${file}`);
});

app.get("/assets/css/:file", (req, res) => {
  const file = req.params.file;

  if (/bundle/.test(file) || /sort/.test(file)) {
    return res
      .header("Cache-Control", `public, max-age=${ASSET_LONG_CACHE_TIME}`)
      .sendFile(`css/${file}`);
  }
  return res
    .header("Cache-Control", `public, max-age=${ASSET_SHORT_CACHE_TIME}`)
    .sendFile(`css/${file}`);
});

function dynamicHandler(dataHandler) {
  return async function (req, res) {
    const context = await dataHandler(req);
    return render(res, context.template, context, DEFAULT_CACHE_TIME_PAGES);
  };
}

function handler(template, dataHandler, cacheTime) {
  return async function (req, res) {
    const context = await dataHandler(req);
    if (context.status === 410) {
      return res.code(410).send("410 GONE");
    }
    if (context.status !== 200) {
      return render(res, "404.hbs", context, NOT_FOUND_CACHE_TIME, 404);
    }
    return render(
      res,
      template,
      context,
      cacheTime || DEFAULT_CACHE_TIME_PAGES,
    );
  };
}

function jsonHandler(dataHandler) {
  return async function (req, res) {
    return res.send(await dataHandler(req));
  };
}

async function render(res, template, context, maxAge, status) {
  const s = status || 200;

  const html = await app.view(
    template,
    Object.assign({ imageUrl: config.get("images.url") }, context),
  );

  res
    .type("text/html")
    .code(s)
    .header("Cache-Control", `public, max-age=${maxAge}`)
    .send(html);
}

function stop() {
  db.destroy();
}

module.exports.app = app;
module.exports.stop = stop;
