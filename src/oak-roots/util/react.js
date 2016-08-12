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


// Merge sets of properties, with properties from later sets "winning".
// Automagically merges "className" and "style" properties.
export function mergeProps(...propSets) {
  // ALWAYS create a new object which merges all the propSets
  const props = Object.assign( {}, ...propSets);

  // Automagically merge "className" and "style" props as necessary
  if (props.className) {
    const allNames = propSets.map( propSet => propSet && propSet.className );
    props.className = classNames(allNames);
  }
  if (props.style) {
    const allStyles = propSets.map( propSet => propSet && propSet.style );
    props.style = Object.assign({}, ...allStyles);
  }

  return props;
}



export default Object.assign({}, exports);
