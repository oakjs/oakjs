//////////////////////////////
//
//  Production webpack config
//
//////////////////////////////

import autoprefixer from "autoprefixer";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import webpack from "webpack";

import common from "./webpack.common.babel.js";

module.exports = Object.assign({},
  // add all common stuff between dev and production
  common.config,

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
