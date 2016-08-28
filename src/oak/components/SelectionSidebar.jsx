//////////////////////////////
// Sidebar for editor which shows selection
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import JSXFragment from "../JSXFragment";
import OakComponent from "./OakComponent";

import "./SelectionSidebar.less";

export default class SelectionSidebar extends OakComponent {
  render() {
    const { oak, components: c } = this.context;
    const { ComponentMenu } = c;
    return (
      <div id="SelectionSidebar">
      	<div id="SelectionSidebar-fixed">
	        <ComponentMenu controller={oak.page}/>
	      </div>
      </div>
    );
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: true }, SelectionSidebar);
