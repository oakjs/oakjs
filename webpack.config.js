'use strict';

var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const SRC = path.join(__dirname, "/src/");
const DIST = path.join(__dirname, "/dist/");


module.exports = {
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

  output: {
    filename: '[name].js',
    path: DIST,
    publicPath: "/"
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

  resolve: {
    // You can leave the following extensions off your imports and it"ll figure it out.
    extensions: ['', '.js', '.jsx'],
    // Assume relative paths are rooted at the same directory as this file.
    root: path.resolve(__dirname),
    // Add common aliases for imports to this map
    alias: {
      oak: __dirname + "/src/oak",
      projects: __dirname + "/src/projects",
      themes: __dirname + "/src/themes",
      "oak-roots": __dirname + "/src/oak-roots",
    }
  },

  // Global variables required and not bundled
  externals: {
    "jquery": "jQuery",
    "react": "React",
    "react-dom": "ReactDOM",
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: SRC,
        loaders: ['babel?cacheDirectory']
      },
      {
        test: /\.css$/, // Only .css files
        loader: 'style!css' // Run both loaders
      },
      {
        test: /\.less$/,
        include: SRC,
        loaders: ['style', 'css', 'less']
      }
    ]
  }
};
