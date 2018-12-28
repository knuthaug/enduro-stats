const bundleMapJs = require('../../bundlemap-js.json')
const bundleMapCss = require('../../bundlemap-css.json')

function replaceJs (fileName) {
  const jsEntry = bundleMapJs[fileName.replace(/.js$/, '')]

  if (jsEntry) {
    return jsEntry.js
  }

  return fileName
}

function replaceCss (fileName) {
  const cssEntry = bundleMapCss[fileName]

  return cssEntry || fileName
}

module.exports = fileName => {
  if (fileName.includes('.js')) {
    return replaceJs(fileName)
  }

  if (fileName.includes('.css')) {
    return replaceCss(fileName)
  }

  return fileName
}
