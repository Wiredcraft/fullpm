'use strict';

let path = require('path');
let webpack = require('webpack');

let baseConfig = require('./base');
let defaultSettings = require('./defaults');
let HtmlWebpackPlugin = require('html-webpack-plugin')

let config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, '../src/index'),
  cache: false,
  devtool: null,
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      },
      // Put them together will broken build process
      API_BASE_URL:
        JSON.stringify(process.env.API_BASE_URL || 'http://localhost:3000')
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin(),
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
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;
