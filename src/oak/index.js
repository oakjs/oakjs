import oak from "./oak.js";

export api from "./api";
export ComponentController from "./ComponentController";
export ComponentLoader from "./ComponentLoader";
export JSXElement from "./JSXElement";
export OakEvent from "./OakEvent";
export Page from "./Page";
export Project from "./Project";
export Section from "./Section";

// utilities
export roots from "oak-roots";

// Test stuff
//export parserTest from "./parserTest";

// assign everything we've loaded to the oak singleton
Object.assign(oak, exports);

// export the oak object as the default
export default oak;
