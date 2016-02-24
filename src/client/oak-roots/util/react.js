//////////////////////////////
//  React Utility functions
//////////////////////////////


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

export default Object.assign({}, exports);
