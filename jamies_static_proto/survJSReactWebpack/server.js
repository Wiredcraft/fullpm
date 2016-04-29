var path = require('path')
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')

new WebpackDevServer(webpack(config), {
  contentBase: path.join(__dirname, './build'),
  publicPath: config.output.publicPath,
  historyApiFallback: true,
  hot: true
}).listen(8080, '0.0.0.0', function (err) {
  if (err) console.log(err)
  console.log('Listening at 0.0.0.0:8080')
})
