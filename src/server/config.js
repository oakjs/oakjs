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
