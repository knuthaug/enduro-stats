const feather = require('feather-icons')
const ui = require('./ui.js')

document.addEventListener('DOMContentLoaded', function (event) {
  feather.replace()
  setupShowHideRider()
})

function setupShowHideRider () {
  [...document.querySelectorAll('.shower')]
    .forEach(element => {
      element.addEventListener('click', e => {
        const cur = e.currentTarget
        cur.classList.toggle('plus-rotate')
        let el = cur.parentNode.parentNode.nextSibling.nextSibling
        el.classList.toggle('hide')
      })
    })
}

