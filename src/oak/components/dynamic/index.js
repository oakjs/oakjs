export function dynamic1(callback) {
  require.ensure([], () => callback(require("./Dynamic1.jsx")))
}

export function dynamic2(callback) {
  require.ensure([], () => callback(require("./Dynamic2.jsx")))
}

export default Object.assign({}, exports);
