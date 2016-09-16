//////////////////////////////
//
//  Common webpack stuff between dev and production
//
//  NOTE: You can't use `import` or ES2015 in this file!
//        Old-school `require()` for you!
//
//////////////////////////////

var path = require("path");

const paths = {
  root:         __dirname,
  src:          path.join(__dirname, "src"),
  build:        path.join(__dirname, "build")
};

// Add paths based on the above
Object.assign(paths, {
  server:       path.join(paths.src, "server"),
  router:       path.join(paths.src, "router"),
  projects:     path.join(paths.src, "projects"),
  oak:          path.join(paths.src, "oak"),
  "oak-roots":  path.join(paths.src, "oak-roots"),
  // NOTE: `public` is a reserved word, so access as `config.paths["public"]`...
  "public":     path.join(paths.src, "public"),
  themes:       path.join(paths.src, "themes"),
});


module.exports = {
  // NOTE: not part of the webpack standard!
  paths: Object.assign({}, paths, {
    // webpack input files
    oakWebpackEntryRoot: path.join(paths.router, "index.js"),
    oakWebackHTMLTemplate: path.join(paths.router, "index.template.html"),
    // webpack output files
    oakBuildHTMLFile: path.join(paths.build, "index.html"),
  }),

  output: {
    path: paths.build,
    filename: "[name].js",
    publicPath: "/"
  },

  resolve: {
    // You can leave the following extensions off your imports and it"ll figure it out.
    extensions: ["", ".js", ".jsx"],
    // Assume relative paths are rooted at the same directory as this file.
    root: path.resolve(paths.root),
    // Add common aliases for imports to this map
    alias: paths,
  },

  // Global variables required and not bundled
  externals: {
    "acorn-jsx": "acorn",
    "acorn": "acorn",
    "babel-core": "Babel",
    "jquery": "jQuery",
    "react": "React",
    "react-dom": "ReactDOM",
    "react-router": "ReactRouter"
  },


  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: paths.src,
        loader: "babel",
        query: {
          "cacheDirectory": "",
          "presets": [
            "es2015",
            "stage-1",
            "react"
          ],
          "plugins": [
            "transform-decorators-legacy"
          ]
        }
      },
      {
        test: /\.css$/, // Only .css files
        loader: "style!css" // Run both loaders
      },
      {
        test: /\.less$/,
        include: paths.src,
        loaders: ["style", "css", "less"]
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'file-loader'
      }

    ]
  }
};
