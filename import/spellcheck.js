
const subs = {
  'Greg Shaw': 'Greg Saw',
  'Tom Haukom': 'Tom Ole Haukom',
  'Edgars C?rulis': 'Edgars Cirulis',
  'Niclas S. Andersen': 'Niclas Stensrud Andersen',
  'Niclas Andersen': 'Niclas Stensrud Andersen'
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
    .replace(/^\w|\s\w/g, upperCase)
    .replace(/-[a-z]/g, upperCase) // convert first char after hyphen to UPPERCASE
    .replace(/^[æøå]|\s[æøå]/g, upperCase) // convert first char after hyphen to UPPERCASE
    .replace(/^[äö]|\s[äö]/g, upperCase) // convert first char after hyphen to UPPERCASE
}

function upperCase (str) {
  return str.toUpperCase()
}

module.exports.check = check
