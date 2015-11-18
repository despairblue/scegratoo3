import router from 'router'

const app = require('koa')()
const responseTime = require('response-time').default()
const logger = require('logger').default()
const koaStatic = require('koa-static')('scegratoo/public')

const port = process.env.PORT || 5000

app
  .use(responseTime)
  .use(logger)
  .use(koaStatic)
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port, function () {
  console.log(`Node app is running on ${port}`)
})
