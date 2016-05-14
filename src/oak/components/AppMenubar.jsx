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
          <Dropdown text="Go" showArrow={false} action="hide">
            <Menu>
              <MenuItem onClick={oak.actions.showFirstPage} disabled={oak.page && oak.page.isFirst}>Show First Page</MenuItem>
              <MenuItem onClick={oak.actions.showPreviousPage} disabled={oak.page && oak.page.isFirst}>Show Previous Page</MenuItem>
              <MenuItem onClick={oak.actions.showNextPage} disabled={oak.page && oak.page.isLast}>Show Next Page</MenuItem>
              <MenuItem onClick={oak.actions.showLastPage} disabled={oak.page && oak.page.isLast}>Show Last Page</MenuItem>
              <Divider/>
              <MenuItem onClick={oak.actions.showFirstSection} disabled={oak.section && oak.section.isFirst}>Show First Section</MenuItem>
              <MenuItem onClick={oak.actions.showPreviousSection} disabled={oak.section && oak.section.isFirst}>Show Previous Section</MenuItem>
              <MenuItem onClick={oak.actions.showNextSection} disabled={oak.section && oak.section.isLast}>Show Next Section</MenuItem>
              <MenuItem onClick={oak.actions.showLastSection} disabled={oak.section && oak.section.isLast}>Show Last Section</MenuItem>
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
              <Submenu disabled>Jump to Section</Submenu>
              <Divider/>
              <MenuItem onClick={oak.actions.saveSection} Xdisabled={oak.section && !oak.section.isDirty}>Save Section...</MenuItem>
              <MenuItem onClick={oak.actions.createSection}>New Section...</MenuItem>
              <MenuItem onClick={oak.actions.deleteSection}>Delete Section...</MenuItem>
              <MenuItem onClick={oak.actions.renameSection}>Rename Section...</MenuItem>
              <MenuItem onClick={oak.actions.duplicateSection}>Duplicate Section...</MenuItem>
              <MenuItem disabled>Rearrange Sections...</MenuItem>
            </Menu>
          </Dropdown>
          <Dropdown text="Page" showArrow={false} action="hide">
            <Menu>
              <MenuItem hidden={oak.state.editing} onClick={oak.actions.startEditing}>Edit Page</MenuItem>
              <MenuItem hidden={!oak.state.editing} onClick={oak.actions.stopEditing}>Stop Editing Page</MenuItem>
              <MenuItem disabled>Page Settings...</MenuItem>
              <Submenu disabled>Jump to Page</Submenu>
              <Divider/>
              <MenuItem onClick={oak.actions.savePage} disabled={oak.page && !oak.page.isDirty}>Save Page...</MenuItem>
              <MenuItem onClick={oak.actions.createPage}>New Page...</MenuItem>
              <MenuItem onClick={oak.actions.deletePage}>Delete Page...</MenuItem>
              <MenuItem onClick={oak.actions.renamePage}>Rename Page...</MenuItem>
              <MenuItem onClick={oak.actions.duplicatePage}>Duplicate Page...</MenuItem>
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
