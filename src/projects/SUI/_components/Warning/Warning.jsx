const { OakComponent } = oak.components.Oak;
export default class Warning extends OakComponent {
  render() {
    const { SUI } = this.context.components;
    return <SUI.Message icon="small warning sign" size="small" appearance="warning" {...this.props}/>
  }
}

import DragProps from "oak/DragProps";
DragProps.register("", { droppable: false }, Warning);
