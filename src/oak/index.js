import oak from "./oak";

export api from "./api";
export app from "./app";
export Card from "./Card";
export ComponentController from "./ComponentController";
export ComponentLoader from "./ComponentLoader";
export JSXElement from "./JSXElement";
export OakEvent from "./OakEvent";
export Project from "./Project";
export Section from "./Section";

// utilities
export roots from "oak-roots";

// Random react components
export components from "./components";

// Test stuff
//export parserTest from "./parserTest";

// app extensions for editing
//import _editor from "./editor";

// assign everything we've loaded to the oak singleton
Object.assign(oak, exports);

// export the oak object as the default
export default oak;
