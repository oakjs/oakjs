//////////////////////////////
//  Bind a named action to be performed later, eg within an `onClick` handler.
//////////////////////////////

function bind(actionName, ...args) {
  const action = oak.actions[actionName];
  if (!action) {
    console.warn(`oak.actions.bind(${actionName}): action not found!`);
    return Function.prototype;
  }
  return action.bind(oak, ...args);
}

export default { bind };
