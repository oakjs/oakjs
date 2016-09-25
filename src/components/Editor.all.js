// Components for individual consumption,
export function Control(callback){ require.ensure([], () => callback(require("./Editor/Control"))) };
export function Checkbox(callback){ require.ensure([], () => callback(require("./Editor/Control").Checkbox)) };
export function Input(callback){ require.ensure([], () => callback(require("./Editor/Control").Input)) };
export function Output(callback){ require.ensure([], () => callback(require("./Editor/Control").Output)) };
export function Password(callback){ require.ensure([], () => callback(require("./Editor/Control").Password)) };
export function Text(callback){ require.ensure([], () => callback(require("./Editor/Control").Text)) };
export function CSSLength(callback){ require.ensure([], () => callback(require("./Editor/CSSControls").CSSLength)) };
export function Dropdown(callback){ require.ensure([], () => callback(require("./Editor/Dropdown"))) };
export function ElementEditor(callback){ require.ensure([], () => callback(require("./Editor/ElementEditor"))) };
export function Error(callback){ require.ensure([], () => callback(require("./Editor/Error"))) };
export function Form(callback){ require.ensure([], () => callback(require("./Editor/Form"))) };
export function Group(callback){ require.ensure([], () => callback(require("./Editor/Group"))) };
export function Label(callback){ require.ensure([], () => callback(require("./Editor/Label"))) };
export function NumericUnitControl(callback){ require.ensure([], () => callback(require("./Editor/NumericUnitControl"))) };
export function HTMLSelect(callback){ require.ensure([], () => callback(require("./Editor/Select").HTMLSelect)) };
export function Select(callback){ require.ensure([], () => callback(require("./Editor/Select").Select)) };

// Export all as a map
export default {...exports};
