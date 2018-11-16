const app = require('./app')
const log = require('./log.js')

app.listen(8080, () => {
  log.info(`Started on http://localhost:${8080}`)
})

