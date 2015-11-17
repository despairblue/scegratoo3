var APP = __dirname + '/scegratoo/public'

module.exports = {
  context: APP,
  devtool: 'eval',
  entry: [
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
        'babel?presets[]=react,presets[]=es2015'
      ]
    }]
  }
}
