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
// NOTE: also requires flags in `.babelrc`  :(
var useHMR = false;

var vendors = [
  "classnames",
  "react",
  "react-dom",
  "react-router",
];

var plugins = [
  new HtmlWebpackPlugin({
    filename: "index.html",
    template: common.paths.oakWebackHTMLTemplate,
    inject: true
  }),
  new webpack.optimize.CommonsChunkPlugin("common.js"),
];

if (useHMR) {
  vendors.push(
    "webpack-hot-middleware/client",
    "react-transform-hmr",
    "react-transform-catch-errors",
    "redbox-react"
  );
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
}


module.exports = Object.assign({},
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
    // devtool: "sourcemap",
    // faster: gets you to the file / method
    devtool: "eval-cheap-module-source-map",
    // fastest: really imprecise, doesn"t work with .jsx
    // devtool: "eval",

    entry: {
      vendors: vendors,
      oak: [
        common.paths.oakWebpackEntryRoot
      ],
    },

    plugins: plugins,

  }
);
