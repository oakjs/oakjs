const OakComponent = oak.components.OakComponent;
export default class Todo extends OakComponent {
  render() {
    const { components:c } = this.context;
    return <c.Message icon="small checkmark" size="small" appearance="success" header="TODO:" {...this.props}/>
  }
};


import { editify } from "oak/EditorProps";
editify({ droppable: false }, Todo);
