
const subs = {
  'Greg Shaw': 'Greg Saw',
  'Tom Haukom': 'Tom Ole Haukom',
  'Edgars C?rulis': 'Edgars Cirulis',
  'Niclas S. Andersen': 'Niclas Stensrud Andersen',
  'Niclas Andersen': 'Niclas Stensrud Andersen',
  'Ted Johansen Rekrutt': 'Ted Johansen',
  'Ole-Christian Soland Mellerud Mellerud': 'Ole-Christian Soland Mellerud',
  'Anders Paalgardkleven': 'Anders Paalgard Kleven',
  'Bård Stokke': 'Bård Sturla Stokke',
  'Christoffer E Bakke': 'Christoffer Engebretsen Bakke',
  'Elinborg Olafsdottir': 'Elinborg Ólafsdóttir',
  'Johan- Jørgen Lindgaard-Strømberg': 'Johan-Jørgen Lindgaard-Strømberg',
  'Mads Pedersen Rekrutt': 'Mads Pedersen',
  'Oscar Schiøtz Smith Rekrutt': 'Oscar Schiøtz Smith',
  'Rikke Westivg': 'Rikke Westvig',
  'Synne Marie Moss Opsand': 'Synne Opsand',
  'Tim Glazebrook': 'Timothy Glazebrook',
  'Silje K. Holmsen': 'Silje Katarina Holmsen',
  'Silje Holmsen': 'Silje Katarina Holmsen',
  'Espen Johnsen': 'Espen Bergli-Johnsen',
  'Sander Solvær Rekrutt': 'Sander Solvær',
  'Morten Ligård Rekrutt': 'Morten Ligård',
  'Anders Rustberggaard': 'Anders Rustberggard',
  'Anne Melbo': 'Anne Melbø',
  'Baard Hellebostrand': 'Baard Mark Hellebostad',
  'Baard Hellebostad': 'Baard Mark Hellebostad',
  'Bjørn Kvande': 'Bjørn Jarle Kvande',
  'Emil Aamil Carlson': 'Emil Aamli Carlson',
  'Emily Benham': 'Emily Benham Kvåle',
  'Frank Jonny Brenn': 'Frank Jonny Brenno',
  'Frode Kristian Ditlefsen': 'Frode Kristian Møller Ditlefsen',
  'Hans Christian Kivespussi Kåsen': 'Hans Christian Kåsen',
  'Henrik Mühlbradt': 'Henrik Mülhbradt',
  'Henrik Muhlbradt': 'Henrik Mülhbradt',
  'Johannes Lagos': 'Johannes Dvorak Lagos',
  'Julie Appelkvist': 'Julie E. H. Appelkvist',
  'Julie H. Appelkvist': 'Julie E. H. Appelkvist',
  'Kristoffer Haugeland': 'Kristoffer Haugland',
  'Magnus Sørli': 'Magnus Slinger Sørli',
  'Martin Rødal': 'Martin Rødahl',
  'Oscar Smith': 'Oscar Schiøtz Smith',
  'Petter Saleen': 'Petter Salen',
  'Preben Nøkleby': 'Preben Alexander Nøkleby',
  'Severin Poppe': 'Severin Poppe Midteide',
  'Thomas Asbjornhus': 'Thomas Gajda Asbjørnhus',
  'Tobias Sandengren': 'Tobias Sandengen',
  'Trygve Veslum': 'Trygve Stansberg Veslum',
  'Zakarias Johansen': 'Zakarias Blom Johansen',
  'Ove Tigergutt Grøndal': 'Ove Grøndal'
}

function check (name) {
  const n = normalizeCase(name)
  if (subs.hasOwnProperty(n)) {
    return subs[n]
  }

  return n
}

function normalizeCase (name) {
  return name.toLowerCase()
    .replace(/[|]/g, '') // cleanup
    .replace(/\s+/g, ' ') // cleanup
    .replace(/^\w|\s\w/g, upperCase)
    .replace(/-[a-z]/g, upperCase) // convert first char after hyphen to UPPERCASE
    .replace(/^[æøå]|\s[æøå]/g, upperCase) // norwegian chars
    .replace(/^[äö]|\s[äö]/g, upperCase) // swedish chars
    .replace(/^[ó]|\s[ó]/g, upperCase) // icelandic chars
    .trim()
}

function upperCase (str) {
  return str.toUpperCase()
}

module.exports.check = check
module.exports.normalizeCase = normalizeCase
