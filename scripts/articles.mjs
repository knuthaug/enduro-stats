import Db from '../import/db.js'
import { readdir, readFileSync } from 'fs'
import { join } from 'path'
import cmd from 'command-line-args'
import parser from 'gray-matter'
import { marked } from 'marked'

const db = new Db()
const dir = 'articles'
init()

async function init () {
  const optionDefinitions = [
    { name: 'delete', alias: 'd', type: Boolean },
    { name: 'add', alias: 'a', type: Boolean },
    { name: 'id', alias: 'i', type: Number },
    { name: 'file', alias: 'f', type: String }
  ]

  const options = cmd(optionDefinitions)
  console.log(options)

  if (options.delete) {
    console.log('deleting all articles')
    await db.deleteArticles()
    db.destroy()
  }

  if (options.add && !options.file) {
    console.log(`adding all files in ${dir}`)
    readdir(dir, function (err, files) {
      // handling error
      if (err) {
        return console.log('Unable to scan directory: ' + err)
      }
      // listing all files using forEach
      files.forEach(async function (filename) {
        // Do whatever you want to do with the file
        const fullName = join(dir, filename)
        const filedata = readFileSync(fullName)
        const { data, content } = parser(filedata)
        const formatted = marked.parse(content)
        // console.log(data, formatted);
        const value = await db.insertArticle({ ...data, body: formatted })
        console.log(`inserted article in file ${fullName}`)
      })
      db.destroy()
    })
  }
}
