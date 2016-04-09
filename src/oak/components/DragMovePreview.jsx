//////////////////////////////
// Drag selection rectangle
//
// Draw this when the mouse goes down and it will draw a dashed rectangle for you
//  and call the `onDrag*` callbacks as the mouse moves.
//////////////////////////////

import React, { PropTypes } from "react";

import Point from "oak-roots/Point";
import Rect from "oak-roots/Rect";

import oak from "../oak";

import OakComponent from "./OakComponent";
import "./DragMovePreview.css";

export default class DragMovePreview extends OakComponent {
  static propTypes = {
    preview: PropTypes.any,       // Drag preview elements -- clone of the thing that's being moved.
                                  // Should have an outer element which is sized according to CLIENT RECTs
    offset: PropTypes.any,        // Offset for preview element
    size: PropTypes.any,          // Size of preview element
    getTarget: PropTypes.func,    // Return target element for current mouse point.

    // Callbacks for drag events, called as:
    //    `callback(event, { target })`
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragCancel: PropTypes.func,
    onDragStop: PropTypes.func,
  }

  static defaultProps = {
    offset: new Point()
  }

  constructor() {
    super(...arguments);
    this.state = {};
  }

  componentDidMount() {
    super.componentDidMount();
    this.startDragging();
  }


  //////////////////////////////
  // Drag event handlers
  //////////////////////////////
  startDragging() {
    // Start watching drag when mounted
    oak.event.initDragHandlers({
      flag: "dragMoving",
      onDragStart: this.onDragStart,
      onDrag: this.onDrag,
      onDragCancel: this.onDragCancel,
      onDragStop: this.onDragStop,
      getDragInfo: this.updateTarget
    });
  }

  onDragStart = (event, info) => {
    // Empty the preview container
    const $container = this.$ref();
    $container.empty();

    // Ingest the preview inside the container
    const { preview } = this.props;
    if (preview) $container.append(preview);

    if (this.props.onDragStart) this.props.onDragStart(event, info);
  }

  onDrag = (event, info) => {
    const $container = this.$ref();

    // offset the container according to the mouse
    const { offset } = this.props;
    const offsetMousePoint = oak.event.clientLoc.subtract(offset);
    $container.css(offsetMousePoint.style);

    if (this.props.onDrag) this.props.onDrag(event, info);
  }

  onDragCancel = (event, info) => {
    if (this.props.onDragCancel) this.props.onDragCancel(event, info);
  }

  onDragStop = (event, info) => {
    if (this.props.onDragStop) this.props.onDragStop(event, info);
  }

  //////////////////////////////
  // Drag geometry and selection
  //////////////////////////////

  getTarget = () => {
    if (this.props.getTarget) return this.props.getTarget();
    return oak.event._mouseOid;
  }

  // Update our `state.target` and `state.selectionRects` based on current geometry.
  updateTarget = (event) => {
    const state = {
      target: (oak.event.dragMoving ? this.getTarget(event) : undefined)
    }
    this.setState(state);
    return state;
  }

  //////////////////////////////
  // Rendering
  //////////////////////////////

  render() {
    return (
      <div className="oak DragMovePreview"/>
    );
  }
}
