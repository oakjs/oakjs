//////////////////////////////
//  React Utility functions
//////////////////////////////

import { knownProperties, unknownProperties } from "./object";

// `classNames`, concept stolen from:  http://jedwatson.github.io/classnames
export function classNames (...args) {
  return args.map( arg => {
    if (!arg) return "";
    if (Array.isArray(arg)) return classNames(...arg);
    switch (typeof arg) {
      case "number":
      case "string":  return arg;
      default:
        return Object.keys(arg).map( key => arg[key] ? key : "")
                .filter(Boolean)
                .join(" ");
    }
  }).filter(Boolean)
    .join(" ");
}


// Return subset of `props` which were defined in `Component.propTypes`.
export function knownProps(props, Component) {
  return knownProperties(props, Component.propTypes);
}

// Return subset of `props` which were NOT defined in `Component.propTypes`.
export function unknownProps(props, Component) {
  return unknownProperties(props, Component.propTypes);
}


export default Object.assign({}, exports);
