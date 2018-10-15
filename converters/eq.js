const fs = require('fs')
const { promisify } = require('util')

const stat = promisify(fs.stat)

class EqConverter {

  constructor(filename) {
    this.filename = filename
  }

  async load() {
    const stats = await stat(this.filename)

    if(stats.isFile()) {
      return this
    }

    throw new Error(`file ${this.filename} does not exist`)
  }

}

module.exports = EqConverter
