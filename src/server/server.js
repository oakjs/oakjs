/* eslint no-console: 0 */

import express from "express";
import path from "path";
import webpack from "webpack";
import webpackMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

const isDeveloping = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = isDeveloping ? 3000 : process.env.PORT;
const oak = express();

import config from "./config";

//////////////////////////////
// Hot Module Reload setup
//////////////////////////////

if (isDeveloping) {
  var compiler = webpack(config.dev);
  var middleware = webpackMiddleware(compiler, {
    publicPath: config.dev.output.publicPath,
    contentBase: config.paths.client,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  oak.use(middleware);
  if (config.useHMR) oak.use(webpackHotMiddleware(compiler));
}


//////////////////////////////
//  Common for dev and production
//////////////////////////////

// anything in `public` gets served directly
oak.use(express.static(config.paths.public));

// API routines split into their own file
import apiRouter from "./api";
oak.use("/api", apiRouter);


//////////////////////////////
//  Dev & production specific
//////////////////////////////
if (isDeveloping) {
  oak.get("*", function response(request, response) {
    response.write(middleware.fileSystem.readFileSync(config.paths.oakBuildHTMLFile));
    response.end();
  });
} else {
  oak.use(express.static(config.paths.build));
  oak.get("*", function response(request, response) {
    response.sendFile(config.paths.oakBuildHTMLFile);
  });
}


//////////////////////////////
//  Start listening
//////////////////////////////
oak.listen(port, "localhost", function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info("==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port);
});
