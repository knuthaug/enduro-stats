const firstRunPlugins = [
  require('postcss-import')(),
  require('cssnano')()
]

const secondRunPlugins = [
  require('postcss-hash')({
    manifest: './bundlemap-css.json'
  })
]

module.exports = ctx => ({
  map: { inline: false },
  plugins: ctx.file.dirname.includes('dist') ? secondRunPlugins : firstRunPlugins
})
