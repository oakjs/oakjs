'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC = path.join(__dirname, "/src/");
const DIST = path.join(__dirname, "/dist/");

module.exports = {
  entry: [
    path.join(SRC, 'index.js')
  ],
  output: {
    path: DIST,
    filename: '[name].min.js'
//    filename: '[name]-[hash].min.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.template.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  resolve: {
    // You can leave the following extensions off your imports and it"ll figure it out.
    extensions: ['', '.js', '.jsx'],
    // Assume relative paths are rooted at the same directory as this file.
    root: path.resolve(__dirname),
    // Add common aliases for imports to this map
    alias: {
      oak: "src/oak",
      projects: "src/projects",
      themes: "src/themes"
    }
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      include: SRC,
      loader: 'babel'
    }, {
      test: /\.json?$/,
      loader: 'json'
    }, {
      test: /\.css$/,
      loader: "style!css"
    }]
  },
  postcss: [
    require('autoprefixer')
  ]
};
