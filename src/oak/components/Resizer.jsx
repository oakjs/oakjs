//////////////////////////////
// Overlay which shows/manages selection
//////////////////////////////

import { autobind } from "oak-roots/util/decorators";

import OakComponent from "./OakComponent";

import "./Resizer.css";


export class Resizer extends OakComponent {

  @autobind
  onClick(event) {}

  render() {
    const { rect } = this.props;
    return (
      <div className="oak Resizer" style={rect} onClick={this.onClick}>
        <ResizeHandle side="tl"/>
        <ResizeHandle side="t"/>
        <ResizeHandle side="tr"/>

        <ResizeHandle side="l"/>
        <ResizeHandle side="r"/>

        <ResizeHandle side="bl"/>
        <ResizeHandle side="b"/>
        <ResizeHandle side="br"/>
      </div>
    )
  }
}

export class ResizeHandle extends OakComponent {
  render() {
    const { side } = this.props;
    return (
      <div className={`oak ResizeHandle ${side}`} />
    )
  }
}


// Export all as a bundle.
export default Object.assign({}, exports);
