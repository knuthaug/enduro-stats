const inquirer = require('inquirer')
const cmd = require('command-line-args')

const Db = require('../import/db.js')
var fs = require('fs');
const db = new Db()

const bylineMap = {
  'Jon Borgersen': {
    text: 'Jon Borgersen',
    url: 'http://jonborgersen.com/'
  },
  'Pål Westgaard': {
    text: 'Pål Westgaard',
    url: 'http://westgaardfoto.no/'
  },
  'Moldestad Photography': {
    text: 'Moldestad Photography',
    url: 'https://www.facebook.com/moldestadphotography/'
  },
  'Eirik Grønevik': {
    text: 'Eirik Grønevik/mtbfoto.no',
    url: 'http://mtbfoto.no/'
  },
  'Kristoffer H. Kippernes': {
    text: 'Kristoffer H. Kippernes/Terrengsykkel',
    url: 'http://terrengsykkel.no/'
  },
  'Ola Morken': {
    text: 'Ola Morken',
    url: ''
  }

}

init();

async function init() {
  const optionDefinitions = [
    { name: 'race', alias: 'r', type: String, defaultOption: true },
  ]

  const options = cmd(optionDefinitions)
  startWithByline(options.race, options)
}

async function startWithByline(race, options) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'byline',
        message: 'Velg byline',
        choices: Object.keys(bylineMap)
      }
    ])
    .then(async answers => {
      startWithList(race, options, bylineMap[answers.byline])
    })

}

async function startWithList(raceId, options, byline) {
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
      await matchImage(answers, byline)
      startWithList(raceId, options, byline)
    });
}

async function matchImage(answers, byline) {
  //console.log(JSON.stringify(answers, null, '  '));
  const parts = answers.rider.split(';')
  const uid = parts[3]
  const bib = parts[0]
  const riderId = parts[2]
  //mv image to images/uid.jpg

  fs.rename(`raw_images/${bib}.jpg`, `images/${uid}.jpg`, function(err) {
    if ( err ) {
      console.log('ERROR: ' + err);
      return
    }
    console.log(`renamed image images/${bib}.jpg to images/${uid}.jpg`)
  });
  //update riders table with byline
  await db.addByline(riderId, byline.text, byline.url)
  console.log(`added byline info to rider ${riderId}`)
  //add to file
  fs.appendFile('scripts/byline.sql', `UPDATE riders set byline_text='${byline.text}', byline_url='${byline.url}' where id=${riderId};\n`, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  //restart
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
    return `${r.bib};${r.name};${r.id};${r.uid}`
  })
}
