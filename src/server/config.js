//////////////////////////////
// Server config
//////////////////////////////

// Re-export webpack configs
import common from "../../webpack.common.babel.js";

import dev from "../../webpack.config.babel.js";
import production from "../../webpack.production.config.babel.js";

export default {
  common,
  paths: common.paths,
  dev,
  production,
}


// import babel external helpers for everyone downstream
import "babel-core/external-helpers";

// Ignore .less/.css/image files in server compilation.
// NOTE: this will likely break server-side page generation...
require.extensions['.less'] = Function.prototype;
require.extensions['.css'] = Function.prototype;
require.extensions['.png'] = Function.prototype;
require.extensions['.jpg'] = Function.prototype;

