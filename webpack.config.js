//////////////////////////////
//
//  Dev webpack config
//
//  NOTE: You can't use `import` or ES2015 in this file!
//        Old-school `require()` for you!
//
//////////////////////////////

var express = require("express");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

var common = require("./webpack.common.js");

// MASTER FLAG for whether we're using Hot Module Reload or not
// NOTE: also requires some changes in `package.json`  :(
//
// See `if (useHMR)` below:
var useHMR = false;


var config = Object.assign({},
  // add all common stuff between dev and production
  common,

  // dev-specific
  {
    // pass useHMR flag down for the server
    // NOTE: non-standard!
    useHMR : useHMR,

    // Unknown URLs go to "/index.html" -- this makes routing work
    historyApiFallback: true,

    // SOURCE MAP OPTIONS
    // slow but you get line numbers in chrome
    devtool: "sourcemap",
    // faster: gets you to the file / method
    //devtool: "eval-cheap-module-source-map",
    // fastest: really imprecise, doesn"t work with .jsx
    // devtool: "eval",

    entry: {
      oak: [
        common.paths.oakWebpackEntryRoot
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: common.paths.oakWebackHTMLTemplate,
        inject: true
      }),
    ],

  }
);


if (useHMR) {
  // Add HMR stuff as a separate bundle
  config.entry.vendors = [
    "webpack-hot-middleware/client",
    "react-transform-hmr",
    "react-transform-catch-errors",
    "redbox-react"
  ];

  // Add plugins and split HMR code out into its own bundle
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin("common.js"),
  );
}


module.exports = config;
