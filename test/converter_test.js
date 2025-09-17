const tap = require("tap");
const Converter = require("../import/converters/converter.js");

tap.test("K17x classname converts to Kvinner senior", async (t) => {
  const conv = new Converter();
  t.equal(conv.className("K17+"), "Kvinner senior", "class name is converted");
  t.end();
});

tap.test("Kvinner åpen klasse el-sykkel is not converted", async (t) => {
  const conv = new Converter();
  t.equal(
    conv.className("Kvinner Åpen klasse El-sykkel"),
    "Kvinner Åpen klasse El-sykkel",
    "class name is not converted",
  );
  t.end();
});

tap.test("Menn åpen klasse el-sykkel is not converted", async (t) => {
  const conv = new Converter();
  t.equal(
    conv.className("Menn Åpen klasse El-sykkel"),
    "Menn Åpen klasse El-sykkel",
    "class name is not converted",
  );
  t.equal(
    conv.className("Menn Åpen klasse El-sykke"),
    "Menn Åpen klasse El-sykke",
    "class name is not converted",
  );
  t.equal(
    conv.className("Menn Åpen EL"),
    "Menn Åpen EL",
    "class name is not converted",
  );
  t.end();
});

tap.test("Menn junior", async (t) => {
  const conv = new Converter();
  t.equal(conv.className("Menn jr"), "Menn junior", "class name is converted");
  t.end();
});

tap.test("Menn sport", async (t) => {
  const conv = new Converter();
  t.equal(
    conv.className("Menn sport"),
    "Menn sport",
    "class name is not converted",
  );
  t.end();
});

tap.test("Menn 17+", async (t) => {
  const conv = new Converter();
  t.equal(conv.className("M 17+"), "Menn senior", "class name is converted");
  t.end();
});

tap.test("K 17+", async (t) => {
  const conv = new Converter();
  t.equal(conv.className("K 17+"), "Kvinner senior", "class name is converted");
  t.end();
});

tap.test("Kvinner sport", async (t) => {
  const conv = new Converter();
  t.equal(
    conv.className("Kvinner sport"),
    "Kvinner sport",
    "class name is not converted",
  );
  t.end();
});

tap.test("Kvinner El-sykkel", async (t) => {
  const conv = new Converter();
  t.equal(
    conv.className("Kvinner EL-sykkel"),
    "Kvinner EL-sykkel",
    "class name is not converted",
  );
  t.end();
});

tap.test("kvinner junior", async (t) => {
  const conv = new Converter();
  t.equal(
    conv.className("kvinner jr"),
    "Kvinner junior",
    "class name is converted",
  );
  t.end();
});
