const OakComponent = oak.components.OakComponent;
export default class Info extends OakComponent {
  render() {
    const { components:c } = this.context;
    return <c.Message icon="small info circle" size="small" appearance="info" {...this.props}/>
  }
}


import { editify } from "oak/EditorProps";
editify({ droppable: false }, Info);
