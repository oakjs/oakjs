'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC = path.join(__dirname, "/src/");
const DIST = path.join(__dirname, "/dist/");

const common = require("./webpack.common.js");

module.exports = Object.assign({},
  // add all common stuff between dev and production
  common,

  // production-specific
  {
    entry: [
      path.join(SRC, 'index.js')
    ],

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

    postcss: [
      require('autoprefixer')
    ]

  }
);
