//////////////////////////////
// Server config
//////////////////////////////

// Re-export webpack configs
import common from "../../webpack.common.js";

import dev from "../../webpack.config.js";
import production from "../../webpack.production.config.js";

export default {
  common,
  paths: common.paths,
  dev,
  production,
}
