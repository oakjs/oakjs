//////////////////////////////
//
// Stack index creator.
// Uses reflection to initialize lots of tasty stuff for this stack.
//
// NOTE:  This file is COMPLETELY GENERIC!!!
//
//////////////////////////////

// Pull in cards and components and stick them on the stack.
import stack from "./stack";
import * as components from "./components";
import * as cardMap from "./cards";

stack.cardMap = cardMap;
stack.components = components;

export default stack;
