var path = require('path');
var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      path.resolve(__dirname, './app/index')
    ],
    vendors: ['react', 'react-dom']
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'build'),
    publicPath: 'http://localhost:8080/assets/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      },
      '__DEVTOOLS__': true
    }),
    new HtmlwebpackPlugin({
      title: 'Boards!',
      filename: 'index.html',
      template: path.resolve(__dirname, 'index.template.html')
    }),
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
  ],
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.join(__dirname, 'app')
      },
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        include: path.join(__dirname, 'app')
      }
      // ,{
      //   test: /\.(woff|ttf|svg|eot)$/,
      //   loader: 'url-loader?limit=100000'
      // },
      // {
      //   test: /\.(png|jpg|gif)$/,
      //   loader: 'file-loader'
      // }
    ]
  }
};
