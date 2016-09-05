const OakComponent = oak.components.OakComponent;
export default class InfoHint extends OakComponent {
  render() {
    const { components:c } = this.context;
    return (
      <span style={{cursor:"pointer", marginLeft:10}}>
        <c.Icon circular icon="info" appearance="tiny grey inverted"/>
        <c.Popup appearance="very wide" {...this.props}/>
      </span>
    );
  }
}


import { editify } from "oak/EditorProps";
editify({ droppable: false }, InfoHint);
