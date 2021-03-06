//////////////////////////////
//  React Utility functions
//////////////////////////////

import { PropTypes } from "react";

import Rect from "oak-roots/Rect";
import { requestAnimationFrame } from "./browser";
import { knownProperties, unknownProperties } from "./object";

export const stringOrFn = PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]);
export const boolOrFn = PropTypes.oneOfType([ PropTypes.bool, PropTypes.func ]);

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
// If you want some props which *are* in propTypes, pass them after the `Component`,
//	and we'll add them if their values are not `undefined`.
// e.g.	`unknownProps(this.props, this.constructor, "id", "className", "style")`
export function unknownProps(props, Component, ...extrasToAdd) {
	// Get a map of known keys, MINUS `extrasToAdd`
	let knownProps = Component.propTypes;
	if (extrasToAdd.length) {
		knownProps = {...knownProps};
		extrasToAdd.forEach(key => { delete knownProps[key] });
	}
	return unknownProperties(props, knownProps);
}


// Merge sets of properties, with properties from later sets "winning".
// Automagically merges "className" and "style" properties.
// Recursively calls `mergeProps()` for any properties that end in "Props".  (????)
export function mergeProps(...propSets) {
  // ALWAYS create a new object which merges all the propSets
  const props = Object.assign({}, ...propSets);

  // Automagically merge "className" and "style" props as necessary
  if (props.className) {
    const allNames = propSets.map( propSet => propSet && propSet.className );
    props.className = classNames(allNames);
  }

  if (props.style) {
    const allStyles = propSets.map( propSet => propSet && propSet.style );
    props.style = Object.assign({}, ...allStyles);
  }

  for (var key in props) {
    if (key.endsWith("Props")) {
      const allProps = propSets.map( propSet => propSet && propSet[key] );
      props[key] = mergeProps(...allProps);
    }
  }

  return props;
}

// Update the css style of `element` to match `rect`.
// `rect` can be a `Rect` object or a function which returns a `Rect`.
// If `getRect()` returns `undefined`, clears the style.
// NOTE: MODIFIES THE DOM!  This may get overwritten on update if React manipulates `element.style`.
export function updateRect(element, rect) {
	if (!element) return;

	// If `rect` is a function, recurse with the actual value.
	if (rect instanceof Function) return updateRect(element, rect());

	const style = (rect instanceof Rect ? rect.styleString : "");

	// Use `requestAnimationFrame` to update so we're separating our read/write cycles.
	requestAnimationFrame( () => element.setAttribute("style", style) );
}

// Show or hide an `element` according to boolean `condition`,
// NOTE: MODIFIES THE DOM!  This may get overwritten on update if React manipulates `element.style`.
export function toggleElement(element, condition) {
	if (element) element.style.display = (!!condition ? "block" : "none");
}

export default {...exports};
