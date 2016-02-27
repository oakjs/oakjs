import oak from "./oak";

export api from "./api";
export app from "./app";
export CardComponent from "./CardComponent";
export CardController from "./CardController";
export ComponentLoader from "./ComponentLoader";
export CustomComponent from "./CustomComponent";
export JSXElement from "./JSXElement";
export ProjectComponent from "./ProjectComponent";
export ProjectController from "./ProjectController";
export StackComponent from "./StackComponent";
export StackController from "./StackController";

// utilities
export roots from "oak-roots";

// Random react components
export components from "./components";

// Test stuff
export parserTest from "./parserTest";


// assign everything we've loaded to the oak singleton
Object.assign(oak, exports);

// export the oak object as the default
export default oak;
