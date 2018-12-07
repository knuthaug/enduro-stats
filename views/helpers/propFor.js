module.exports = function propFor (num, key) {
  if (key === 'time') {
    return `stage${num}_time`
  }
  return `stage${num}_rank`
}
