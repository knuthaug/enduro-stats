const clubSubs = {
  Bmk: "Bergen MTB klubb",
  Gresvikifstisyklister: "Gresvik IF stisyklister",
  "Arin Sk": "Aron SK",
  "Arok Sk": "Aron SK",
  Nbnl: "NBNL",
};

const subs = {
  "Greg Shaw": "Greg Saw",
  "Tom Haukom": "Tom Ole Haukom",
  "Edgars C?rulis": "Edgars Cirulis",
  "Niclas S. Andersen": "Niclas Stensrud Andersen",
  "Niclas Andersen": "Niclas Stensrud Andersen",
  "Ted Johansen Rekrutt": "Ted Johansen",
  "Ole-Christian Soland Mellerud Mellerud": "Ole-Christian Soland Mellerud",
  "Anders Paalgardkleven": "Anders Paalgard Kleven",
  "Bård Stokke": "Bård Sturla Stokke",
  "Christoffer E Bakke": "Christoffer Engebretsen Bakke",
  "Elinborg Olafsdottir": "Elinborg Ólafsdóttir",
  "Johan- Jørgen Lindgaard-Strømberg": "Johan-Jørgen Lindgaard-Strømberg",
  "Mads Pedersen Rekrutt": "Mads Pedersen",
  "Oscar Schiøtz Smith Rekrutt": "Oscar Schiøtz Smith",
  "Rikke Westivg": "Rikke Westvig",
  "Synne Marie Moss Opsand": "Synne Opsand",
  "Tim Glazebrook": "Timothy Glazebrook",
  "Silje K. Holmsen": "Silje Katarina Holmsen",
  "Silje Holmsen": "Silje Katarina Holmsen",
  "Espen Johnsen": "Espen Bergli-Johnsen",
  "Sander Solvær Rekrutt": "Sander Solvær",
  "Morten Ligård Rekrutt": "Morten Ligård",
  "Anders Rustberggaard": "Anders Rustberggard",
  "Anne Melbo": "Anne Melbø",
  "Baard Hellebostrand": "Baard Mark Hellebostad",
  "Baard Hellebostad": "Baard Mark Hellebostad",
  "Bjørn Kvande": "Bjørn Jarle Kvande",
  "Emil Aamil Carlson": "Emil Aamli Carlson",
  "Emily Benham": "Emily Benham-Kvåle",
  "Jon Eid": "Jon Vassbø Eid",
  "Emily Benham Kvåle": "Emily Benham-Kvåle",
  "Frank Jonny Brenn": "Frank Jonny Brenno",
  "Frode Kristian Ditlefsen": "Frode Kristian Møller Ditlefsen",
  "Hans Christian Kivespussi Kåsen": "Hans Christian Kåsen",
  "Henrik Mühlbradt": "Henrik Mülhbradt",
  "Henrik Muhlbradt": "Henrik Mülhbradt",
  "Henrik Mülbradt": "Henrik Mülhbradt",
  "Johannes Lagos": "Johannes Dvorak Lagos",
  "Julie Appelkvist": "Julie E. H. Appelkvist",
  "Julie H. Appelkvist": "Julie E. H. Appelkvist",
  "Kristoffer Haugeland": "Kristoffer Haugland",
  "Magnus Sørli": "Magnus Slinger Sørli",
  "Martin Rødal": "Martin Rødahl",
  "Oscar Smith": "Oscar Schiøtz Smith",
  "Bård G. Røisli": "Bård Gujord Røisli",
  "Jo Røisli": "Jo Gujord Røisli",
  "Petter Saleen": "Petter Salen",
  "Preben Nøkleby": "Preben Alexander Nøkleby",
  "Severin Poppe": "Severin Poppe Midteide",
  "Thomas Asbjornhus": "Thomas Gajda Asbjørnhus",
  "Tobias Sandengren": "Tobias Hoel Sandengen",
  "Trygve Veslum": "Trygve Stansberg Veslum",
  "Zakarias Johansen": "Zakarias Blom Johansen",
  "Ove Tigergutt Grøndal": "Ove Grøndal",
  "Aleksander Dystetud": "Aleksander Dysterud",
  "Aleksander Ødegaard": "Aleksander Ødegård",
  "Anne Melboe": "Anne Melbø",
  "Anne Melnø": "Anne Melbø",
  "Astri Knudsen": "Astrid Knudsen",
  "Bård S Pettersen": "Bård Stærkebye Pettersen",
  "Bård S. Pettersen": "Bård Stærkebye Pettersen",
  "Bård Pettersen": "Bård Stærkebye Pettersen",
  "Emil Carlson": "Emil Aamli Carlson",
  "Ida Nærum": "Ida Rydland Nærum",
  "Jon Håvard H.appelkvist": "Jon Håvard Appelkvist",
  "Glenn Mørk": "Glenn Roger Mørk",
  "Geir Bjørndalen": "Geir Vidar Bjørndalen",
  "Helene Moland": "Helene Thon Moland",
  "Henning Hovlan": "Henning Hovland",
  "Klaus Kjærnet": "Klaus Jørgen Kjærnet",
  "Magnus Grønberg": "Magnus Grönberg",
  "Mari Guton": "Mari Guton Olsen",
  "Marit Skjelbred Knudsen": "Marit Skjelbred-Knudsen",
  "Marie Pettersson": "Marie Petterson",
  "Martin Solheim": "Martin Solheim Sigley",
  "Mats Uverud Nyegaard": "Mats Nyegaard",
  "Michael Cook": "Michael Overbeck Cook",
  "Noah Holmefjord Dalland": "Noah Holmefjord-Dalland",
  "Ole Henrik Løland Eriksen": "Ole Henrik Eriksen",
  "Per Christian Dahl Larsen": "Per Christian Dahl",
  "Pål Gimmestad": "Pål Kristian Gimmestad",
  "Steinar Holoes": "Steinar Holøs",
  "Trygve Loyd": "Trygve Loyd Sannesmoen",
  "Rickard Sundell": "Tage Rickard Sundell",
  "Anette Bastnes": "Anette Røssum Bastnes",
  "Stian Eilfsen": "Stian Eilifsen",
  "Hilde Strædet": "Hilde Sangesland Strædet",
  "Hilde Sangesland": "Hilde Sangesland Strædet",
  "Ida Hakonsson": "Ida Håkonsson",
  "Jørgen Strømquist": "Jørgen Beyer Strømquist",
  "Jonas Strømquist": "Jonas Beyer Strømquist",
  "Lars Sandviken": "Lars Vatnebryn Sandviken",
  "Jarstø Karl Håkon": "Karl Håkon Jarstø",
  "Andre Jaksland Aamodt": "André Aamodt",
  "Andre Aamodt": "André Aamodt",
  "Andreas Hegrum": "Andreas Hegrum Askjer",
  "Andreas Askjer": "Andreas Hegrum Askjer",
  "Erlend Askjer": "Erlend Hegrum Aksjer",
  "Eirik Haanes": "Eirik Lind Hånes",
  "Eirik Hånes": "Eirik Lind Hånes",
  "Elin K Morgan": "Elin Katrine Morgan",
  "Elin Morgan": "Elin Katrine Morgan",
  "Elin K. Morgan": "Elin Katrine Morgan",
  "Elise Bugge": "Elise Marie Bugge",
  "Joar Sorvik Solem": "Joar Sørvik Solem",
  "Joar Solem": "Joar Sørvik Solem",
  "Jørgen Dolvik Husbyn": "Jørgen Dølvik Husbyn",
  "Paal Nyman": "Paal Nymann",
  "Petter Fryksen Lund": "Petter Fyksen Lund",
  "Philip Bjørkesett": "Philip Johannessen Bjørkesett",
  "Sebastian M. Andreassen": "Sebastian Andreassen",
  "Thomas Asbjørnhus": "Thomas Gajda Asbjørnhus",
  "Tormod Brg Olsen": "Tormod Berg Olsen",
  "Srian Lunn": "Stian Lunn",
  "Siv Nygaard": "Siv Elisabeth Nygaard",
  "Oyvind Sætra": "Øyvind Sætra",
  "Anna Littorin Sandbu": "Anna Littorin-Sandbu",
  "Albin Littorin Sandbu": "Albin Littorin-Sandbu",
  "Christoffer E. Bakke": "Christoffer Engebretsen Bakke",
  "Eirik Lind Hanes": "Eirik Lind Hånes",
  "Gunnar Vestholm": "Gunnar Westholm",
  "Kristoffer Westgaard": "Kristoffer Ylven Westgaard",
  "Jostein Sanderlien Hole": "Jostein Hole",
  "Hans Jørgen Kvale": "Hans Jørgen Kvåle",
  "June Janson": "June Jansson",
  "Magnus Brandtzeg": "Magnus Brandtzæg",
  "Martin I. Dalen": "Martin Innerdal Dalen",
  "Martin Solheim Sigleye": "Martin Solheim Sigley",
  "Ole Andre Tveit": "Ole André Tveit",
  "Ole Christian Fagerii": "Ole Christian Fagerli",
  "Simon Børjars": "Simon Börjars",
  "Thomas Stenedohansen": "Thomas Stene-Johansen",
  "Per Morten Mølsted": "Morten Mølsted",
  "Vidar Folden": "Vidar Berentsen Folden",
  "Kristel Linnea Mulelid": "Kristel Karlsen-Mulelid",
  "Anders G. Skarstein": "Anders Skarstein",
  "Anders Guttormson Skarstein": "Anders Skarstein",
  "Brage Evensen Vestavik": "Brage Vestavik",
  "Christoffer Djupvik-Hansen": "Christoffer Djupvik Hansen",
  "Eirik Ølnes Ødegårdstuen": "Eirik Ødegårdstuen",
  "Frida Helena Rønning": "Frida Helen Rønning",
  "Jan Henrik Heilund": "Jan Henrik Høilund",
  "Jan Henrik Hoilund": "Jan Henrik Høilund",
  "Kari Olstad": "Kari Gulden Olstad",
  "Mads Henrik R. Kjemperud": "Mads Henrik Kjemperud",
  "Mads Øftshus": "Mads Øfsthus",
  "Martin Sigley": "Martin Solheim Sigley",
  "Noah Møllernyegaard": "Noah Møller Nyegaard",
  "Ole-Hermann Bergby": "Ole-Herman Bergby",
  "Per Henrik Thorp": "Per Henrik Opsal Thorp",
  "Petter Anthonse": "Petter Anthonsen",
  "Petter Anthansen": "Petter Anthonsen",
  "Sean Engebretsen": "Sean Ingvaldsen Engebretsen",
  "Sebastien Amat": "Sebastien Amat Finstad",
  "Sindre Aaroy Holtet": "Sindre Aarøy Holtet",
  "Stein Roger Sollien": "Stein-Roger Sollien",
  "Stine Torgersbraten": "Stine Torgersbråten",
  "Tobias Sandengen": "Tobias Hoel Sandengen",
  "Tor Andre Vedvik": "Tor André Vedvik",
  "Tord Kylling": "Tord Irgens Kylling",
  "Sten Andre Stenkjaer": "Sten André Stenkjær",
  "Sten Andre Stenkjær": "Sten André Stenkjær",
};

function check(name) {
  const n = normalizeCase(name);
  if (subs[n]) {
    return subs[n];
  }

  return n;
}

function checkClub(name) {
  const n = normalizeCase(name);
  if (clubSubs.hasOwnProperty(n)) {
    return clubSubs[n];
  }

  return n;
}

function normalizeCase(name) {
  return name
    .toLowerCase()
    .replace(/[|]/g, "") // cleanup
    .replace(/\s+/g, " ") // trunk multiple spaces
    .replace(/^\w|\s\w/g, upperCase)
    .replace(/-[a-z]/g, upperCase) // convert first char after hyphen to UPPERCASE
    .replace(/^[æøåóäöź]|\s[æøåóäö]/g, upperCase) // swedish chars
    .replace(/\s(\w)\s/, " $1. ")
    .trim();
}

function upperCase(str) {
  return str.toUpperCase();
}

module.exports.check = check;
module.exports.checkClub = checkClub;
module.exports.normalizeCase = normalizeCase;
