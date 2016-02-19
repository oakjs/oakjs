import oak from "./oak";

// Project/Stack/Card
export Card from "./Card";
export CardController from "./CardController";
export JSXElement from "./JSXElement";
export ComponentController from "./ComponentController";
export Project from "./Project";
export ProjectController from "./ProjectController";
export Stack from "./Stack";
export StackController from "./StackController";

export roots from "oak-roots";

export parserTest from "./parserTest";

// Card components.
// NOTE: in a separate file so we don't get a circular dependency.
import * as components from "./components";
Object.assign(exports, components);

// assign everything we've loaded to the oak singleton
Object.assign(oak, exports);

// export the oak object as the default
export default oak;
