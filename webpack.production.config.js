//////////////////////////////
//
//  Production webpack config
//
//  NOTE: You can't use `import` or ES2015 in this file!
//        Old-school `require()` for you!
//
//////////////////////////////

var autoprefixer = require("autoprefixer");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var path = require("path");
var webpack = require("webpack");

var common = require("./webpack.common.js");

module.exports = Object.assign({},
  // add all common stuff between dev and production
  common,

  // production-specific
  {
    entry: [
      common.paths.oakWebpackEntryRoot
    ],

    plugins: [
      new webpack.optimize.OccurenceOrderPlugin(),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: common.paths.oakWebackHTMLTemplate,
        inject: "body",
      }),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
          screw_ie8: true
        }
      }),
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
      })
    ],

    postcss: [
      autoprefixer
    ]

  }
);
