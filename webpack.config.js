'use strict';

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC = path.join(__dirname, "/src/");
const DIST = path.join(__dirname, "/dist/");

const common = require("./webpack.common.js");

module.exports = Object.assign({},
  // add all common stuff between dev and production
  common,

  // dev-specific
  {
    // Unknown URLs go to "/index.html" -- this makes routing work
    historyApiFallback: true,

    // SOURCE MAP OPTIONS
    // slow but you get line numbers in chrome
    // devtool: "sourcemap",
    // faster: gets you to the file / method
    devtool: 'eval-cheap-module-source-map',
    // fastest: really imprecise, doesn't work with .jsx
    // devtool: 'eval',

    entry: {
      vendors: [
        "react",
        "react-dom",
        "webpack-hot-middleware/client",
        "react-router",
        "react-transform-hmr",
        "react-transform-catch-errors",
        "redbox-react",
        "classnames",
      ],
      oak: [
        './src/index.js'
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.template.html',
        inject: true
      }),
  //    new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.CommonsChunkPlugin('common.js'),
    ],

  }
);
