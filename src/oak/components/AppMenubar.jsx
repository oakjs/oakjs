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
    const { ActionItem, Divider, Dropdown, Menu, MenuItem, Submenu } = c;
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
              <ActionItem id="oak.undo"/>
              <ActionItem id="oak.redo"/>
              <Divider/>
              <ActionItem id="oak.cutElements"/>
              <ActionItem id="oak.copyElements"/>
              <ActionItem id="oak.pasteElements"/>
              <ActionItem id="oak.removeElements"/>
              <Divider/>
              <ActionItem id="oak.selectAll"/>
              <ActionItem id="oak.deselectAll"/>
            </Menu>
          </Dropdown>
          <Dropdown text="Project" showArrow={false} action="hide">
            <Menu>
              <ActionItem id="oak.showFirstProject"/>
              <ActionItem id="oak.showPreviousProject"/>
              <ActionItem id="oak.showNextProject"/>
              <ActionItem id="oak.showLastProject"/>
              <Divider/>
              <ActionItem id="oak.startEditingProject"/>
              <ActionItem id="oak.stopEditingProject"/>
              <MenuItem disabled>Project Settings...</MenuItem>
              <Divider/>
              <ActionItem id="oak.saveProject"/>
              <ActionItem id="oak.createProject"/>
              <ActionItem id="oak.deleteProject"/>
              <ActionItem id="oak.renameProject"/>
              <ActionItem id="oak.duplicateProject"/>
            </Menu>
          </Dropdown>
          <Dropdown text="Section" showArrow={false} action="hide">
            <Menu>
              <ActionItem id="oak.showFirstSection"/>
              <ActionItem id="oak.showPreviousSection"/>
              <ActionItem id="oak.showNextSection"/>
              <ActionItem id="oak.showLastSection"/>
              <Divider/>
              <ActionItem id="oak.startEditingSection"/>
              <ActionItem id="oak.stopEditingSection"/>
              <Divider/>
              <MenuItem disabled>Section Settings...</MenuItem>
              <Submenu disabled>Jump to Section</Submenu>
              <Divider/>
              <ActionItem id="oak.saveSection"/>
              <ActionItem id="oak.createSection"/>
              <ActionItem id="oak.deleteSection"/>
              <ActionItem id="oak.renameSection"/>
              <ActionItem id="oak.duplicateSection"/>
              <MenuItem disabled>Rearrange Sections...</MenuItem>
            </Menu>
          </Dropdown>
          <Dropdown text="Page" showArrow={false} action="hide">
            <Menu>
              <ActionItem id="oak.showFirstPage"/>
              <ActionItem id="oak.showPreviousPage"/>
              <ActionItem id="oak.showNextPage"/>
              <ActionItem id="oak.showLastPage"/>
              <Divider/>
              <ActionItem id="oak.startEditingPage"/>
              <ActionItem id="oak.stopEditingPage"/>
              <MenuItem disabled>Page Settings...</MenuItem>
              <Submenu disabled>Jump to Page</Submenu>
              <Divider/>
              <ActionItem id="oak.savePage"/>
              <ActionItem id="oak.createPage"/>
              <ActionItem id="oak.deletePage"/>
              <ActionItem id="oak.renamePage"/>
              <ActionItem id="oak.duplicatePage"/>
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
