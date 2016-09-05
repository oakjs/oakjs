const { OakComponent } = oak.components.Oak;
export default class Warning extends OakComponent {
  render() {
    const { SUI } = this.context.components;
    return <SUI.Message icon="small warning sign" size="small" appearance="warning" {...this.props}/>
  }
}

import { editify } from "oak/EditorProps";
editify({ droppable: false }, Warning);
