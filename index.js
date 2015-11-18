Error.stackTraceLimit = Infinity

require('babel-core/register')({
  // necessary so that the local app/node_modules/* will be transpiled
  only: /scegratoo/,
  sourceMaps: 'inline',
  // sourceFileName: '(filenameRelative).es6',
  sourceRoot: 'babel'
})
require('babel-polyfill')

global.Promise = require('bluebird')
Promise.longStackTraces()

require('./scegratoo/app.js')
