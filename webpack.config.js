// var path = require('path')
var webpack = require('webpack')

var APP = __dirname + '/scegratoo/public'

module.exports = {
  context: APP,
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080',
    'webpack/hot/only-dev-server',
    // reloads if it can't hot replace
    // 'webpack/hot/dev-server',
    './scripts/app.js'
  ],
  output: {
    path: APP,
    filename: 'bundle.js'
  },
  devServer: {
    proxy: {
      '*': {
        target: 'http://localhost:5000',
        secure: false
      }
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: [
        // XXX: does not work atm
        // 'react-hot',
        'babel?presets[]=react,presets[]=es2015'
      ]
    }]
  }
}
