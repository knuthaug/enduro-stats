const feather = require('feather-icons')
const ui = require('./ui.js')

const { h4, table, thead, tbody, th, tr, td, strong, a } = ui.create()

document.addEventListener('DOMContentLoaded', function (event) {
  feather.replace()
  setupShowHideRider()
})

function setupShowHideRider () {
  [...document.querySelectorAll('.shower')]
    .forEach(element => {
      element.addEventListener('click', handleRowExpand)
    })
}

async function handleRowExpand(event) {
  const cur = event.currentTarget
  cur.classList.toggle('plus-rotate')
  const row = cur.parentNode.parentNode
  let el = row.nextSibling.nextSibling
  el.classList.toggle('hide')
  const data = row.getAttribute('data-results')
  if(!data) {
    const uid = row.getAttribute('data-uid')
    fetch(`/api/series/rider/${uid}`)
      .then(response => response.json())
      .then(json => json)
      .then(data => {
        row.setAttribute('data-results', JSON.stringify(data))
        data.forEach(d => {
          const container = row.nextSibling.nextSibling.firstChild
          container.appendChild(h4({class: 'detail'}, `${d.year}`))
          addTable(d, container)
        })
      })
  }
}

function addTable(data, container) {
  container.appendChild(table([
    tbody(
      data.series.map(s => {
        console.log(s)
        return tr([
          td([
            strong([
              a({href: `/serie/${s.results[0].raceUid}`}, `${s.seriesName}:`)
            ])
          ]),
          ...s.results.map(r => {
            return td([
              a({href: `/ritt/${r.raceUid}`}, `${r.raceName}: ${r.rank}`)
            ])
          })
        ])
      })
    )
  ]))
}
