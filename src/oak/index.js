import oak from "./oak";

export api from "./api";
export app from "./app";
export Card from "./Card";
export ComponentController from "./ComponentController";
export ComponentLoader from "./ComponentLoader";
export JSXElement from "./JSXElement";
export Project from "./Project";
export Stack from "./Stack";

// utilities
export roots from "oak-roots";

// Random react components
export components from "./components";

// Test stuff
export parserTest from "./parserTest";

// app extensions for editing
import _events from "./events";
import _editor from "./editor";


// assign everything we've loaded to the oak singleton
Object.assign(oak, exports);

// export the oak object as the default
export default oak;
