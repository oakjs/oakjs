import oak from "./oak";

export api from "./api";
export app from "./app";
export CardComponent from "./CardComponent";
export CardController from "./CardController";
export JSXElement from "./JSXElement";
export ComponentController from "./ComponentController";
export ComponentIndex from "./ComponentIndex";
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
