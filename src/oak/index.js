import oak from "./oak.js";

export roots from "oak-roots";
export api from "./api";
export classes from "./classes";

// Test stuff
//export parserTest from "./parserTest";

// assign everything we've loaded to the oak singleton
Object.assign(oak, exports);

// export the oak object as the default
export default oak;
