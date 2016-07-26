'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

let HtmlWebpackPlugin = require('html-webpack-plugin')
let config = Object.assign({}, baseConfig, {
  entry: [
    './src/index'
  ],
  cache: true,
  devtool: 'eval-source-map',
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      // Put them together will broken build process
      API_BASE_URL:
        JSON.stringify(process.env.API_BASE_URL || 'http://127.0.0.1:3000')
    }),
    new HtmlWebpackPlugin({
      hash: true,
      filename: '../index.html',
      template: 'src/index.template.html'
    })
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel-loader',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;
