const OakComponent = oak.components.OakComponent;
export default class InfoHint extends OakComponent {
  render() {
    const { SUI } = this.context.components;
    return (
      <span style={{cursor:"pointer", marginLeft:10}}>
        <SUI.Icon circular icon="info" appearance="tiny grey inverted"/>
        <SUI.Popup appearance="very wide" {...this.props}/>
      </span>
    );
  }
}


import { editify } from "oak/EditorProps";
editify({ droppable: false }, InfoHint);
