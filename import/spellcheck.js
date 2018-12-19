
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
  'Elinborg Olafsdottir' : 'Elinborg Ólafsdóttir',
  'Johan- Jørgen Lindgaard-Strømberg': 'Johan-Jørgen Lindgaard-Strømberg',
  'Mads Pedersen Rekrutt': 'Mads Pedersen',
  'Oscar Schiøtz Smith Rekrutt': 'Oscar Schiøtz Smith',
  'Rikke Westivg': 'Rikke Westvig',
  'Synne Marie Moss Opsand': 'Synne Opsand',
  'Tim Glazebrook': 'Timothy Glazebrook'
}

function check (name) {
  if (subs.hasOwnProperty(name)) {
    return subs[name]
  }

  return normalizeCase(name)
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
