//////////////////////////////
//
//  Common stuff between dev and production webpacks
//
//////////////////////////////
'use strict';

var path = require('path');
const SRC = path.join(__dirname, "/src/");
const DIST = path.join(__dirname, "/dist/");

module.exports = {

  output: {
    path: DIST,
    filename: '[name].js',
    publicPath: "/"
  },

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
