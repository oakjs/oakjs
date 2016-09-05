const OakComponent = oak.components.OakComponent;
export default class Warning extends OakComponent {
  render() {
    const { components:c } = this.context;
    return <c.Message icon="small warning sign" size="small" appearance="warning" {...this.props}/>
  }
}

import { editify } from "oak/EditorProps";
editify({ droppable: false }, Warning);
