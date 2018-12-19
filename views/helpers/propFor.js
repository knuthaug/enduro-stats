module.exports = function propFor (num, key) {
  if (key === 'time') {
    return `stage${num}_time`
  } else if (key === 'rank') {
    return `stage${num}_rank`
  }
  return `stage${num}_behind_leader`
}
