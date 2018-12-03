const bundleMapJs = require('../../bundlemap-js.json')

function replaceJs (fileName) {
  const jsEntry = bundleMapJs[fileName.replace(/.js$/, '')]

  if (jsEntry) {
    return jsEntry.js
  }

  return fileName
}

module.exports = fileName => {
  if (fileName.includes('.js')) {
    return replaceJs(fileName)
  }

  return fileName
}
