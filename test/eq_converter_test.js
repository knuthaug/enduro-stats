const tap = require('tap');
const EqConverter = require('../import/converters/eq.js');
const path = require('path');

tap.test('read the file if it exists', async (t) => {
  const eq = new EqConverter(
    path.join(__dirname, 'data/kongsberg-2012-kvinner-fe1.csv')
  );
  const file = await eq.load();

  t.type(file, 'EqConverter');
  t.end();
});

tap.test('If file does not exist, throw error', async (t) => {
  const eq = new EqConverter('./data/foo.csv');

  try {
    await eq.load();
  } catch (error) {
    t.type(error, 'Error');
  }

  t.end();
});

tap.test('parse file with one stage in it', async (t) => {
  const eq = new EqConverter(
    path.join(__dirname, 'data/kongsberg-2012-kvinner-fe1.csv'),
    { mode: 'normal' }
  );
  const loaded = await eq.load();
  const data = await loaded.parse();

  t.equal(data.race.name, 'Kongsberg Sykkelenduro', 'race name matches');
  t.equal(data.race.date, '2012-09-29', 'date matches');
  t.equal(data.stages.length, 1, 'number of stages matches stage number');

  t.equal(data.stages[0].name, 'FP 1 - Kongens Gruve', 'stage name matches');
  t.equal(data.stages[0].number, '1', 'stage number matches');

  const r = data.stages[0].results;

  t.equal(r[0].name, 'Anita Løvli', 'name matches source');
  t.equal(r[0].gender, 'F', 'gender is converted');
  t.equal(r[0].time, '12:37.2', 'time in minutes:seconds matches');
  t.equal(
    r[0].acc_time_ms,
    757200,
    'acc_time_ms for first stage is same as stage'
  );
  t.equal(r[0].rank, 1, 'rank is converted');
  t.equal(r[0].status, 'OK', 'status is OK');
  t.equal(r[0].class, 'Kvinner senior', 'class matches');
  t.equal(r[0].club, '', 'club is included');
  t.equal(r[0].team, '', 'team is included');

  t.end();
});

tap.test('parse file and format', async (t) => {
  const eq = new EqConverter(
    path.join(__dirname, 'data/kongsberg-2012-menn-fe2.csv'),
    { mode: 'normal' }
  );
  const loaded = await eq.load();
  const data = await loaded.parse();

  t.equal(data.race.name, 'Kongsberg Sykkelenduro');
  t.equal(data.race.date, '2012-09-29');
  t.equal(data.race.year, '2012');
  t.equal(data.stages[0].number, '2', 'stage number from file');

  t.equal(data.stages[0].name, 'FP 2 - Sachsen');
  t.equal(data.stages[0].number, '2');

  const r = data.stages[0].results;

  t.equal(r[0].name, 'Aslak Mørstad');
  t.equal(r[0].gender, 'M');
  t.equal(r[0].time, '12:52.02');
  t.equal(r[0].acc_time_ms, 772020);
  t.equal(r[0].rank, 1);
  t.equal(r[0].class, 'Menn senior');
  t.equal(r[0].club, '');
  t.equal(r[0].team, '');
  t.equal(r[r.length - 1].status, 'DNS');
  t.end();
});

tap.test('parse file and format, multiday', async (t) => {
  const eq = new EqConverter(
    path.join(__dirname, 'data/nesbyen-2015-menn-fe1.csv'),
    { mode: 'normal' }
  );
  const loaded = await eq.load();
  const data = await loaded.parse();

  t.equal(data.race.name, '80/20 NesbyEnduro', 'name is matched');
  t.equal(data.race.date, '2015-05-23', 'date for race is first date');
  t.equal(data.race.year, '2015', 'year of race is included');
  t.equal(data.stages.length, 1, 'number of stages is included');

  t.end();
});

tap.test('parse file and format, other year', async (t) => {
  const eq = new EqConverter(
    path.join(__dirname, 'data/nesbyen-2013-menn-fe3.csv'),
    { mode: 'normal' }
  );
  const loaded = await eq.load();
  const data = await loaded.parse();

  t.equal(data.race.name, 'NesbyEnduro', 'race name matches');
  t.equal(data.race.date, '2013-06-16', 'race date matches');

  t.equal(data.stages[0].name, 'SS3', 'stage name matches');
  t.equal(data.stages[0].number, '3', 'stage number matches');

  const r = data.stages[0].results;

  t.equal(r[0].name, 'Espen Bergli-Johnsen', 'name matches');
  t.equal(r[0].gender, 'M', 'gender matches');
  t.equal(r[0].time, '12:47.855', 'time matches');
  t.equal(r[0].rank, 1, 'rank matches');
  t.equal(r[0].class, 'Menn senior', 'class matches');
  t.equal(r[0].club, '', 'club i included');
  t.equal(r[0].team, '', 'team is included');
  t.equal(r[r.length - 1].status, 'OK', 'status is ok when finished');
  t.end();
});

tap.test('race has uid, md5 of name and year', async (t) => {
  const eq = new EqConverter(
    path.join(__dirname, 'data/nesbyen-2013-menn-fe3.csv'),
    { mode: 'normal' }
  );
  const loaded = await eq.load();
  const data = await loaded.parse();

  t.equal(data.race.uid, '4504e3dd07d15dec4044e6b2e32df739', 'md5 matches');
  t.end();
});

tap.test('rider has uid, md5 of name', async (t) => {
  const eq = new EqConverter(
    path.join(__dirname, 'data/nesbyen-2013-menn-fe3.csv'),
    { mode: 'normal' }
  );
  const loaded = await eq.load();
  const data = await loaded.parse();
  const r = data.stages[0].results;

  t.equal(r[0].rider_uid, 'e3fdd33aa6dc207cb5c2b2ec7308bff1', 'md5 matches');
  t.end();
});

tap.test('test class name transcribing', (t) => {
  const eq = new EqConverter();
  t.equal(eq.className('1 Menn'), 'Menn senior');
  t.equal(eq.className('4 Kvinner'), 'Kvinner senior');
  t.equal(eq.className('M junior'), 'Menn junior');
  t.equal(eq.className('K junior'), 'Kvinner junior');
  t.equal(eq.className('k junior'), 'Kvinner junior');
  t.equal(eq.className('m jr'), 'Menn junior');
  t.equal(eq.className('3 Lag rekrutt'), 'Lag rekrutt');
  t.equal(eq.className('3Lag rekrutt'), 'Lag rekrutt');
  t.equal(eq.className('Lag'), 'Lag');
  t.end();
});

tap.test('handle eq files not in accumulative mode', async (t) => {
  const eq = new EqConverter(
    path.join(__dirname, 'data/nesbyen-2014-menn-fe1.csv'),
    { acc: false, mode: 'normal' }
  );
  const loaded = await eq.load();
  const data = await loaded.parse();

  t.equal(data.race.name, 'NesbyEnduro 80twenty');
  t.equal(data.race.date, '2014-08-03');
  t.equal(data.race.year, '2014');
  t.equal(data.stages.length, 1, 'number of stages is one');

  t.equal(data.stages[0].name, 'SS1');
  t.equal(data.stages[0].number, '1');

  const r = data.stages[0].results;

  t.equal(r[0].name, 'Ove Grøndal');
  t.equal(r[0].gender, 'M');
  t.equal(r[0].time, '07:46.068');
  t.equal(r[0].stage_time_ms, 466068);
  t.equal(r[0].rank, 1);
  t.equal(r[0].class, 'Menn senior');
  t.equal(r[0].club, '');
  t.equal(r[0].team, '');

  t.equal(r[1].rank, 2);
  t.equal(r[1].stage_time_ms, 477981);

  t.end();
});

tap.test('include club', async (t) => {
  const eq = new EqConverter(
    path.join(__dirname, 'data/traktor-2015-menn-fe1.csv'),
    { acc: false, mode: 'normal' }
  );
  const loaded = await eq.load();
  const data = await loaded.parse();
  const r = data.stages[0].results;

  t.equal(r[0].name, 'Espen Bergli-Johnsen', 'Name if first is Espen Johnsen');
  t.equal(r[0].gender, 'M', 'Gender is M');
  t.equal(r[0].rank, 1, 'rank is first');
  t.equal(r[0].stage_time_ms, 397000, 'time should be correct in ms');
  t.equal(r[0].class, 'Menn senior', 'class is menn senior');
  t.equal(r[0].club, 'Bergen MTB Klubb', 'club is correct');
  t.equal(r[0].team, '', 'team is empty');
  t.end();
});

tap.test('handle results with time in different named column', async (t) => {
  const eq = new EqConverter(
    path.join(__dirname, 'data/nesbyen-2015-menn-fe1.csv'),
    { acc: false, mode: 'normal' }
  );
  const loaded = await eq.load();
  const data = await loaded.parse();

  const r = data.stages[0].results;
  t.equal(r[0].name, 'Zakarias Blom Johansen');
  t.equal(r[0].gender, 'M');
  t.equal(r[0].rank, 1);
  t.equal(r[0].stage_time_ms, 695000, 'time should be correct in ms');
  t.equal(r[0].time, '11:35.0', 'time should be correct in ms');
  t.equal(r[0].class, 'Menn senior');
  t.equal(r[0].club, 'SK Rye sykkel');
  t.equal(r[0].team, '');
  t.end();
});

tap.test('handle jr men from 2014 nesbyen (funky data)', async (t) => {
  const eq = new EqConverter(
    path.join(__dirname, 'data/nesbyen-2014-menn-jr-fe1.csv'),
    { acc: false, mode: 'normal' }
  );
  const loaded = await eq.load();
  const data = await loaded.parse();
  const r = data.stages[0].results;

  t.equal(r[0].name, 'Ted Johansen');
  t.equal(r[0].gender, 'M');
  t.equal(r[0].rank, 1);
  t.equal(r[0].stage_time_ms, 547300, 'time should be correct in ms');
  t.equal(r[0].time, '09:07.3', 'time should be correct in ms');
  t.equal(r[0].class, 'Menn junior');
  t.equal(r[0].club, 'IF Frøy');
  t.equal(r[0].team, '');
  t.end();
});
