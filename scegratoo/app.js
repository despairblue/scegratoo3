const path = require('path')
const app = require('koa')()
const router = require('router')
const responseTime = require('response-time')()
const logger = require('logger')()
const transpile = require('transpile')({
  root: path.join(__dirname, 'public')
}, {
  sourceMaps: 'inline'
})

const port = process.env.PORT || 5000

app
  .use(responseTime)
  .use(logger)
  .use(transpile)
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port, function () {
  console.log(`Node app is running on ${port}`)
})
