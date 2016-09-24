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
var validate = require('webpack-validator');

var common = require("./webpack.common.js");

var config = Object.assign({},

  // add all common stuff between dev and production
  common.config,

  // dev-specific
  {
    // SOURCE MAP OPTIONS
    // slow but you get line numbers in chrome
    //devtool: "source-map",

    // faster: gets you to the file / line number in chrome
    devtool: "cheap-module-source-map",

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

// Run validator in quiet mode to avoid output in stats.
// To view stats:
// 	1) Run `npm run stats`
//	2) Drop resulting `stats.json` file on webpage:
//			https://chrisbateman.github.io/webpack-visualizer/
module.exports = validate(config, { quiet: true });
