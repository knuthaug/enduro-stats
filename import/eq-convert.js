const csv = require('neat-csv')
const fs = require('await-fs')

read(process.argv.slice(2))

async function read (files) {
  console.log('Rank;Startnumber;Firstname;Surname;Gender;Nat;Club;Race;Class;Total Time;Diff Winner')
  files.forEach(async (file) => {
    const stats = await fs.stat(file)

    if (stats.isFile()) {
      const contents = await fs.readFile(file, 'utf-8')
      const raw = await csv(contents, { separator: ',' })
      raw.forEach((row) => {
        console.log(`${row.RankClass};${row.Bib};${row.Firstname};${row.Surname};${row.Gender};${row.Nation};${row.ClubTeamFormatted};${row.PointName.split(/\s/)[1]};${row.ClassName};${row.NetTimeFormatted};${row.DiffTimeClassFormatted}`)
      })
    }
  })
}
