const inquirer = require('inquirer')
const cmd = require('command-line-args')

const Db = require('../import/db.js')
var fs = require('fs');
const db = new Db()

init();

async function init() {
  const optionDefinitions = [
    { name: 'race', alias: 'r', type: String, defaultOption: true },
    { name: 'byline', alias: 'b', type: String },
    { name: 'url', alias: 'u', type: String }
  ]

  const options = cmd(optionDefinitions)
  startWithList(options.race, options)
}

async function startWithList(raceId, options) {
  const riders = await getRiders(raceId)
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'rider',
        message: 'Velg rytter',
        choices: riders
      }
    ])
    .then(async answers => {
      //console.log(JSON.stringify(answers, null, '  '));
      const parts = answers.rider.split(' ')
      const uid = parts[5]
      const bib = parts[0]
      const riderId = parts[4]
      //mv image to images/uid.jpg

      fs.rename(`images/${bib}.jpg`, `images/${uid}.jpg`, function(err) {
        if ( err ) {
          console.log('ERROR: ' + err);
        }
        console.log(`renamed image images/${bib}.jpg to images/${uid}.jpg`)
      });
      //update riders table with byline
      await db.addByline(riderId, options.byline, options.url)
      console.log(`added byline info to rider ${riderId}`)
      //restart
      startWithList(raceId)
    });
}

async function getRiders(id) {
  const list = await db.ridersWithoutImage(id)
  return list.sort((a, b) => {
    if(Number(a.bib) > Number(b.bib)) {
      return 1
    } else if(Number(b.bib) > Number(a.bib)) {
      return -1
    }
    return 0
  }).filter((r) => {
    return r.bib !== ''
  }).map((r) => {
    return `${r.bib} ${r.name} ${r.id} ${r.uid}`
  })
}
