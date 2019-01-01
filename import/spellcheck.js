const clubSubs = {
  'Bmk': 'Bergen MTB klubb',
  'Gresvikifstisyklister': 'Gresvik IF stisyklister'
}

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
  'Henrik Mülbradt': 'Henrik Mülhbradt',
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
  'Ove Tigergutt Grøndal': 'Ove Grøndal',
  'Aleksander Dystetud': 'Aleksander Dystetud',
  'Aleksander Ødegaard': 'Aleksander Ødegård',
  'Anne Melboe': 'Anne Melbø',
  'Anne Melnø': 'Anne Melbø',
  'Astri Knudsen': 'Astrid Knudsen',
  'Bård S Pettersen': 'Bård Stærkebye Pettersen',
  'Bård Pettersen': 'Bård Stærkebye Pettersen',
  'Emil Carlson': 'Emil Aamli Carlson',
  'Ida Nærum': 'Ida Rydland Nærum',
  'Jon Håvard H.appelkvist': 'Jon Håvard Appelkvist',
  'Glenn Mørk': 'Glenn Roger Mørk',
  'Geir Bjørndalen': 'Geir Vidar Bjørndalen',
  'Helene Moland': 'Helene Thon Moland',
  'Henning Hovlan': 'Henning Hovland',
  'Klaus Kjærnet': 'Klaus Jørgen Kjærnet',
  'Magnus Grønberg': 'Magnus Grönberg',
  'Mari Guton': 'Mari Guton Olsen',
  'Marit Skjelbred Knudsen': 'Marit Skjelbred-Knudsen',
  'Marie Pettersson': 'Marie Petterson',
  'Martin Solheim': 'Martin Solheim Sigleye',
  'Mats Uverud Nyegaard': 'Mats Nyegaard',
  'Michael Cook': 'Michael Overbeck Cook',
  'Noah Holmefjord Dalland': 'Noah Holmefjord-Dalland',
  'Ole Henrik Løland Eriksen': 'Ole Henrik Eriksen',
  'Per Christian Dahl Larsen': 'Per Christian Dahl',
  'Pål Gimmestad': 'Pål Kristian Gimmestad',
  'Steinar Holoes': 'Steinar Holøs',
  'Trygve Loyd': 'Trygve Loyd Sannesmoen',
  'Rickard Sundell': 'Tage Rickard Sundell'
}

function check (name) {
  const n = normalizeCase(name)
  if (subs.hasOwnProperty(n)) {
    return subs[n]
  }

  return n
}

function checkClub (name) {
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
module.exports.checkClub = checkClub
module.exports.normalizeCase = normalizeCase
