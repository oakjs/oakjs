const { OakComponent } = oak.components.Oak;
export default class Info extends OakComponent {
  render() {
    const { SUI } = this.context.components;
    return <SUI.Message icon="small info circle" size="small" appearance="info" {...this.props}/>
  }
}


import DragProps from "oak-roots/DragProps";
DragProps.register("", { droppable: false }, Info);
