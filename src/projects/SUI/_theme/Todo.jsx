const { OakComponent } = oak.components.Oak;
export default class Todo extends OakComponent {
  render() {
    const { SUI } = this.context.components;
    return <SUI.Message icon="small checkmark" size="small" appearance="success" header="TODO:" {...this.props}/>
  }
};


import { editify } from "oak/EditorProps";
editify({ droppable: false }, Todo);
