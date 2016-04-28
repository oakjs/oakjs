//////////////////////////////
// Sample editor toolbar
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import JSXFragment from "../JSXFragment";
import OakComponent from "./OakComponent";

import "./AppMenubar.less";

export default class AppMenubar extends OakComponent {
  render() {
    const { oak, components: c } = this.context;
    const { Divider, Dropdown, Menu, MenuItem, Submenu } = c;
    return (
      <div id="AppMenubar">
        <div id="AppMenubar-fixed">
          <Dropdown text="OakJS" showArrow={false} action="hide">
            <Menu>
              <MenuItem disabled>About OakJS</MenuItem>
              <MenuItem disabled>Get Help</MenuItem>
            </Menu>
          </Dropdown>
          <Dropdown text="File" showArrow={false} action="hide">
            <Menu>
              <MenuItem disabled>Open Project...</MenuItem>
              <Submenu disabled>Open Recent...</Submenu>
              <MenuItem disabled>Close Project</MenuItem>
            </Menu>
          </Dropdown>
          <Dropdown text="Edit" showArrow={false} action="hide">
            <Menu>
              <MenuItem onClick={oak.undo} disabled={!oak.canUndo}>Undo</MenuItem>
              <MenuItem onClick={oak.redo} disabled={!oak.canRedo}>Redo</MenuItem>
              <Divider/>
              <MenuItem disabled={oak.nothingSelected} onClick={oak.actions.cutElements}>Cut</MenuItem>
              <MenuItem disabled={oak.nothingSelected} onClick={oak.actions.copyElements}>Copy</MenuItem>
              <MenuItem disabled={oak.nothingSelected} onClick={oak.actions.pasteElements}>Paste</MenuItem>
              <MenuItem disabled={oak.nothingSelected} onClick={oak.actions.removeElements}>Delete</MenuItem>
              <Divider/>
              <MenuItem onClick={oak.actions.selectAll}>Select All</MenuItem>
              <MenuItem onClick={oak.actions.clearSelection} disabled={oak.nothingSelected}>Deselect All</MenuItem>
            </Menu>
          </Dropdown>
          <Dropdown text="Project" showArrow={false} action="hide">
            <Menu>
              <MenuItem disabled>Edit Project</MenuItem>
              <Divider/>
              <MenuItem disabled>Project Settings...</MenuItem>
              <Divider/>
              <MenuItem disabled>New Project...</MenuItem>
              <MenuItem disabled>Duplicate Project...</MenuItem>
            </Menu>
          </Dropdown>
          <Dropdown text="Section" showArrow={false} action="hide">
            <Menu>
              <MenuItem disabled>Edit Section</MenuItem>
              <Divider/>
              <MenuItem disabled>Section Settings...</MenuItem>
              <Submenu disabled>Jump to Section...</Submenu>
              <Divider/>
              <MenuItem disabled>New Section...</MenuItem>
              <MenuItem disabled>Duplicate Section...</MenuItem>
              <MenuItem disabled>Rearrange Sections...</MenuItem>
            </Menu>
          </Dropdown>
          <Dropdown text="Page" showArrow={false} action="hide">
            <Menu>
              <MenuItem hidden={oak.state.editing} onClick={oak.actions.startEditing}>Edit Page</MenuItem>
              <MenuItem hidden={!oak.state.editing} onClick={oak.actions.stopEditing}>Stop Editing Page</MenuItem>
              <Divider/>
              <MenuItem disabled>Page Settings...</MenuItem>
              <Submenu disabled>Jump to Page...</Submenu>
              <Divider/>
              <MenuItem disabled>New Page...</MenuItem>
              <MenuItem disabled>Duplicate Page...</MenuItem>
              <MenuItem disabled>Rearrange Pages...</MenuItem>
            </Menu>
          </Dropdown>
        </div>
      </div>
    );
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: true }, AppMenubar);
