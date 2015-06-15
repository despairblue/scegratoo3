Error.stackTraceLimit = Infinity

require('babel/register')({
  // necessary so that the local app/node_modules/* will be transpiled
  only: /scegratoo/,
  sourceMaps: 'inline',
  // sourceFileName: '(filenameRelative).es6',
  sourceRoot: 'babel'
})

global.Promise = require('bluebird')
Promise.longStackTraces()

require('./scegratoo/app.js')
