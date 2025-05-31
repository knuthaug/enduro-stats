const tap = require("tap");
const { Mylaps } = require("../../import/converters/mylaps.mjs");
const path = require("path");

tap.test("parse complete result file", async (t) => {
  const ml = new Mylaps(path.join(__dirname, "../data/drammen-2017.csv"), {
    datafile: path.join(__dirname, "../data/racedata-drammen2017.json"),
  });

  const loaded = await ml.load();
  const data = await loaded.parse();
  t.equal(data.race.name, "Drammenduro", "race name matches");
  t.equal(data.race.year, 2017, "race year matches");
  t.equal(data.race.date, "2017-07-01", "race date matches");
  t.equal(
    data.race.uid,
    "9c5dc4c9a0ef9b18dc61f514ae9d1eab",
    "race uid matches",
  );
});

tap.test("Object details for stages", async (t) => {
  const ml = new Mylaps(path.join(__dirname, "../data/drammen-2017.csv"), {
    datafile: path.join(__dirname, "../data/racedata-drammen2017.json"),
  });

  const loaded = await ml.load();
  const data = await loaded.parse();

  t.equal(data.stages.length, 5, "correct number of stages");
  const stage1 = data.stages[0];
  const stage2 = data.stages[1];

  t.equal(stage1.name, "FE1", "stage name matches");
  t.equal(stage1.number, 1, "stage number matches");
  t.equal(stage2.name, "FE2", "stage name matches");
  t.equal(stage2.number, 2, "stage number matches");
  t.equal(stage1.results.length, 152, "stage result length matches");
  const rider = stage1.results[0];

  t.equal(rider.name, "Alice Grindheim", "name is correct");
  t.equal(rider.bib, "5", "bib is correct");
  t.equal(
    rider.rider_uid,
    "3a4e5a2c99e22aaf931e06ac5d9320e7",
    "uid is correct",
  );
  t.equal(rider.time, "0:06:14", "time is correct");
  t.equal(rider.gender, "F", "Gender is correct");
  t.equal(rider.class, "Kvinner senior", "class is correct");
  t.equal(rider.club, "", "club is correct");
  t.equal(rider.stage_time_ms, 374000, "time in ms is correct");
  t.equal(rider.acc_time_ms, null, "acc_time_ms is null");
  t.equal(rider.stage_rank, 1, "rank is correct");
  t.equal(rider.status, "OK", "status is correct");

  t.equal(stage1.results[1].stage_rank, 4);

  t.equal(stage1.results[20].time, "00:00:00");
  t.equal(stage1.results[20].stage_rank, 21);
  t.equal(stage1.results[20].stage_time_ms, 0);
  t.equal(stage1.results[20].status, "DNS");
});

tap.test("final status field is correct", async (t) => {
  const ml = new Mylaps(path.join(__dirname, "../data/drammen-2017.csv"), {
    datafile: path.join(__dirname, "../data/racedata-drammen2017.json"),
  });

  const loaded = await ml.load();
  const data = await loaded.parse();

  const lastStage = data.stages[4];
  t.equal(
    lastStage.results[0].final_status,
    "OK",
    "winner has OK final_status",
  );
  t.equal(
    lastStage.results[lastStage.results.length - 1].final_status,
    "DNS",
    "DNS rider has final_status DNS",
  );
  t.equal(
    lastStage.results[lastStage.results.length - 17].final_status,
    "DNF",
    "DSQ rider has final_status DSQ",
  );
  t.equal(
    lastStage.results[21].final_status,
    "DSQ",
    "DSQ rider has final_status DSQ",
  );
  t.equal(
    lastStage.results[21].status,
    "DSQ",
    "DSQ rider has final_status DSQ",
  );
  t.end();
});

tap.test("support for NOOP stages", async (t) => {
  const ml = new Mylaps(path.join(__dirname, "../data/hemsedal-2018.csv"), {
    datafile: path.join(__dirname, "../data/hemsedal-2018-racedata.json"),
  });

  const loaded = await ml.load();
  const data = await loaded.parse();
  t.equal(data.race.name, "Hardbarka enduro", "race name matches");

  const persons = data.stages[4].results.filter((r) => {
    return r.name === "Risto Holm";
  });
  t.equal(
    persons.length,
    0,
    "person should not have a stage 4, as class only has three stages",
  );
});
