//////////////////////////////
//
//  Common webpack stuff between dev and production
//
//////////////////////////////

import path from "path";

const paths = {
  root:         __dirname,
  src:          path.join(__dirname, "src"),
  build:        path.join(__dirname, "build")
};

// Add generic oakjs paths based on the above.
Object.assign(paths, {
  server:       path.join(paths.src, "server"),
  router:       path.join(paths.src, "router"),
  projects:     path.join(paths.src, "projects"),
  oak:          path.join(paths.src, "oak"),
  "oak-roots":  path.join(paths.src, "oak-roots"),
  // NOTE: `public` is a reserved word, so access as `config.paths["public"]`...
  "public":     path.join(paths.src, "public"),
  components:   path.join(paths.src, "components"),
});


// Add webpack / app specific paths.
Object.assign(paths, {
	// webpack input files
	oakWebpackEntryRoot: path.join(paths.router, "index.js"),
	oakWebackHTMLTemplate: path.join(paths.router, "index.template.html"),
	// webpack output files
	oakBuildHTMLFile: path.join(paths.build, "index.html"),
})


export default {
  // Export paths for consumption in specific configs.
  paths: paths,

	// This should be added to specific configs
	//	(in webpack.config.js and webpack.production.config.js)
	config : {
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
						cacheDirectory: true
					}
				},
				{
					test: /\.css$/, // Only .css files
					include: paths.src,
					loaders: ["style", "css"]
				},
				{
					test: /\.less$/,
					include: paths.src,
					loaders: ["style", "css", "less"]
				},
				{
					test: /\.(png|jpg)$/,
					include: paths.src,
					loader: 'url-loader',
					query: {
						limit: 25000
					}
				}

			]
		}
	}
};
