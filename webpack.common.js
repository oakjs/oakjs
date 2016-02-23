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
  client:       path.join(paths.src, "client"),
  projects:     path.join(paths.src, "projects"),
});

// Add paths based on the above
Object.assign(paths, {
  oak:          path.join(paths.client, "oak"),
  "oak-roots":  path.join(paths.client, "oak-roots"),
  public:       path.join(paths.client, "public"),
  themes:       path.join(paths.client, "themes"),
})


module.exports = {
  // NOTE: not part of the webpack standard!
  paths: Object.assign({}, paths, {
    // webpack input files
    oakWebpackEntryRoot: path.join(paths.client, "index.js"),
    oakWebackHTMLTemplate: path.join(paths.client, "index.template.html"),
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
        loaders: ["babel?cacheDirectory"]
      },
      {
        test: /\.css$/, // Only .css files
        loader: "style!css" // Run both loaders
      },
      {
        test: /\.less$/,
        include: paths.src,
        loaders: ["style", "css", "less"]
      }
    ]
  }
};
