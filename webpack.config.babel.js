//////////////////////////////
//
//  Dev webpack config
//
//////////////////////////////

import "babel-core/external-helpers";
import common from "./webpack.common.babel.js";

import HtmlWebpackPlugin from "html-webpack-plugin";
import NpmInstallPlugin from "npm-install-webpack-plugin";
import validate from 'webpack-validator';


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
    	// Auto-install any NPM dependencies this machine needs
    	new NpmInstallPlugin(),

    	// Dynamically load our `index.html` file, which includes all of the bits.
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
