import oak from "./oak";

export api from "./api";
export app from "./app";
export CardComponent from "./CardComponent";
export Card from "./Card";
export ComponentLoader from "./ComponentLoader";
export OakComponent from "./OakComponent";
export JSXElement from "./JSXElement";
export ProjectComponent from "./ProjectComponent";
export Project from "./Project";
export StackComponent from "./StackComponent";
export Stack from "./Stack";

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
