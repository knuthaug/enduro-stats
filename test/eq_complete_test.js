const tap = require("tap");
const { EqConverter } = require("../import/converters/eq.mjs");
const path = require("path");

tap.test("parse complete result file", async (t) => {
  const eq = new EqConverter(path.join(__dirname, "data/oslo-2013.csv"), {
    acc: false,
    mode: "complete",
    datafile: path.join(__dirname, "data/racedata.json"),
  });
  const loaded = await eq.load();
  const data = await loaded.parse();

  t.equal(data.race.name, "Oslo enduro", "race name matches");
  t.equal(data.race.year, 2013, "race year matches");
  t.equal(
    data.race.uid,
    "0220cbd5bc43a80de8e69070c3f2872c",
    "race uid matches",
  );
  t.equal(data.stages.length, 5, "stages matches stage number");
  // t.equal(data.race.stages, 5, 'stages in number too')
});

tap.test("all racedata fields are included", async (t) => {
  const eq = new EqConverter(path.join(__dirname, "data/oslo-2013.csv"), {
    acc: false,
    mode: "complete",
    datafile: path.join(__dirname, "data/racedata.json"),
  });
  const loaded = await eq.load();
  const data = await loaded.parse();

  t.equal(data.race.series, "test", "series name is parsed");
  t.equal(data.race.links.length, 2, "links are parsed");
});

tap.test("Object details for stages, non-accumulative mode", async (t) => {
  const eq = new EqConverter(path.join(__dirname, "data/oslo-2013.csv"), {
    acc: false,
    mode: "complete",
    datafile: path.join(__dirname, "data/racedata.json"),
  });

  const loaded = await eq.load();
  const data = await loaded.parse();
  const stage1 = data.stages[0];

  t.equal(stage1.name, "SS1", "stage name matches");
  t.equal(stage1.number, 1, "stage number matches");
  t.equal(stage1.results.length, 68, "stage result length matches");
  const rider = stage1.results[0];
  // console.log(stage1.results[0])

  t.equal(rider.name, "Stina Bondehagen", "name is correct");
  t.equal(
    rider.rider_uid,
    "105fe7e9a0446b152bef347939aeba57",
    "uid is correct",
  );
  t.equal(rider.time, "2:40", "time is correct");
  t.equal(rider.gender, "F", "Gender is correct");
  t.equal(rider.class, "Kvinner senior", "class is correct");
  t.equal(rider.club, "Oslo", "club is correct");
  t.equal(rider.stage_time_ms, 160000, "time in ms is correct");
  t.equal(rider.behind_leader_ms, 0, "time behind leader in stage is correct");
  t.equal(rider.stage_rank, 1, "rank is correct");

  t.equal(
    stage1.results[1].behind_leader_ms,
    1000,
    "time behind leader in stage is correct",
  );
});

tap.test("dnf/dns tuning", async (t) => {
  const eq = new EqConverter(path.join(__dirname, "data/oslo-2015.csv"), {
    acc: false,
    mode: "complete",
    datafile: path.join(__dirname, "data/racedata-oslo-2015.json"),
  });

  const loaded = await eq.load();
  const data = await loaded.parse();

  const thirdStage = data.stages[2].results.find((s) => {
    return s.class === "Menn senior" && s.name === "Knut Haugen";
  });

  const fourthStage = data.stages[3].results.find((s) => {
    return s.class === "Menn senior" && s.name === "Knut Haugen";
  });

  const lastStage = data.stages[4].results.find((s) => {
    return s.class === "Menn senior" && s.name === "Knut Haugen";
  });

  t.equal(thirdStage.status, "OK", "OK in third stage");
  t.equal(fourthStage.status, "DNS", "DNF in fourth stage");
  t.equal(lastStage.status, "DNS", "DNS in fifth stage");
  t.end();
});

tap.test("Object details for stages, accumulative mode", async (t) => {
  const eq = new EqConverter(
    path.join(__dirname, "data/complete-acc-race.csv"),
    {
      acc: true,
      mode: "complete",
      datafile: path.join(__dirname, "data/complete-acc-racedata.json"),
    },
  );

  const loaded = await eq.load();
  const data = await loaded.parse();
  const stage1 = data.stages[0];

  t.equal(stage1.name, "FP 1 - Kongens Gruve", "stage name matches");
  t.equal(stage1.number, 1, "stage number matches");
  t.equal(stage1.results.length, 100, "stage result length matches");
  const rider = stage1.results[0];

  t.equal(rider.name, "Anita Løvli", "name is correct");
  t.equal(
    rider.rider_uid,
    "e2c668db34a035fcf81263563b8033e3",
    "uid is correct",
  );
  t.equal(rider.time, "12:37.2", "time is correct");
  t.equal(rider.gender, "F", "Gender is correct");
  t.equal(rider.class, "Kvinner senior", "class is correct");
  t.equal(rider.club, "Kongsberg", "club is correct");
  t.equal(rider.acc_time_ms, 757200, "time in ms is correct");
  t.equal(rider.behind_leader_ms, 0, "time behind leader in stage is correct");
  t.equal(rider.stage_rank, null, "stage_rank is null");
  t.equal(rider.rank, 1, "rank is 1");

  t.equal(
    stage1.results[1].behind_leader_ms,
    156800,
    "time behind leader in stage is correct",
  );
});
