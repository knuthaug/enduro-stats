module.exports = function title (status) {
  if(status === 'DNS') {
    return "Rytteren startet ikke rittet"
  }

  if(status === 'DNF') {
    return "Rytteren fullførte ikke rittet"
  }

  if(status === 'DSQ') {
    return "Rytteren ble diskvalifisert"
  }

  return ""
}
