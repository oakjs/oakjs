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
  public:       path.join(__dirname, "public"),
  dist:         path.join(__dirname, "dist"),
  server:       path.join(__dirname, "server"),
  client:       path.join(__dirname, "src")
}

paths.oak =           path.join(paths.client, "oak");
paths["oak-roots"] =  path.join(paths.client, "oak-roots");
paths.projects =      path.join(paths.client, "projects");
paths.themes =        path.join(paths.client, "themes");

module.exports = {
  // NOTE: not part of the webpack standard!
  paths: Object.assign({}, paths, {
    // webpack input files
    oakWebpackEntryRoot: path.join(paths.client, "index.js"),
    oakWebackHTMLTemplate: path.join(paths.client, "index.template.html"),
    // webpack output files
    oakDistHTMLFile: path.join(paths.dist, "index.html"),
  }),

  output: {
    path: paths.dist,
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
    "jquery": "jQuery",
    "react": "React",
    "react-dom": "ReactDOM",
  },


  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: paths.client+"/",
        loaders: ["babel?cacheDirectory"]
      },
      {
        test: /\.css$/, // Only .css files
        loader: "style!css" // Run both loaders
      },
      {
        test: /\.less$/,
        include: paths.client+"/",
        loaders: ["style", "css", "less"]
      }
    ]
  }
};
