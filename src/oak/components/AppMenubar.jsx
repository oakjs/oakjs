//////////////////////////////
//  Menubar for the entire app.
//  TODO: the actual <AppMenu> contents should come from project component...
//  TODO: allow runner project/section/page to add menus & menuItems
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";
import "./AppMenubar.less";

export default class AppMenubar extends OakComponent {
  render() {
    if (this.hidden) return null;
    const { oak, components } = this.context;
    const { Oak, SUI } = components;
    // NOTE: Zindex MUST be above the <EditorToolbar> and <SelectionSidebar>
    return (
      <Oak.FixedPanel id="AppMenubar" appearance="inverted" style={{ zIndex: 100000 }}>

        <Oak.AppMenu text="OakJS">
          <SUI.MenuItem disabled>About OakJS</SUI.MenuItem>
          <SUI.MenuItem disabled>Get Help</SUI.MenuItem>
        </Oak.AppMenu>

        <Oak.AppMenu text="File">
          <SUI.MenuItem disabled>Open Project...</SUI.MenuItem>
          <SUI.Submenu disabled>Open Recent...</SUI.Submenu>
          <SUI.MenuItem disabled>Close Project</SUI.MenuItem>
        </Oak.AppMenu>

        <Oak.AppMenu text="Edit">
          <Oak.ActionItem id="oak.undo"/>
          <Oak.ActionItem id="oak.redo"/>
          <SUI.Divider/>
          <Oak.ActionItem id="oak.cutElements"/>
          <Oak.ActionItem id="oak.copyElements"/>
          <Oak.ActionItem id="oak.pasteElements"/>
          <Oak.ActionItem id="oak.removeElements"/>
          <SUI.Divider/>
          <Oak.ActionItem id="oak.selectAll"/>
          <Oak.ActionItem id="oak.deselectAll"/>
        </Oak.AppMenu>

        <Oak.AppMenu text="Project">
          <Oak.ActionItem id="oak.showFirstProject"/>
          <Oak.ActionItem id="oak.showPreviousProject"/>
          <Oak.ActionItem id="oak.showNextProject"/>
          <Oak.ActionItem id="oak.showLastProject"/>
          <SUI.Divider/>
          <Oak.ActionItem id="oak.startEditingProject"/>
          <Oak.ActionItem id="oak.stopEditingProject"/>
          <SUI.MenuItem disabled>Project Settings...</SUI.MenuItem>
          <SUI.Divider/>
          <Oak.ActionItem id="oak.saveProject"/>
          <Oak.ActionItem id="oak.createProject"/>
          <Oak.ActionItem id="oak.deleteProject"/>
          <Oak.ActionItem id="oak.renameProject"/>
          <Oak.ActionItem id="oak.duplicateProject"/>
        </Oak.AppMenu>

        <Oak.AppMenu text="Section">
          <Oak.ActionItem id="oak.showFirstSection"/>
          <Oak.ActionItem id="oak.showPreviousSection"/>
          <Oak.ActionItem id="oak.showNextSection"/>
          <Oak.ActionItem id="oak.showLastSection"/>
          <SUI.Divider/>
          <Oak.ActionItem id="oak.startEditingSection"/>
          <Oak.ActionItem id="oak.stopEditingSection"/>
          <SUI.Divider/>
          <SUI.MenuItem disabled>Section Settings...</SUI.MenuItem>
          <SUI.Submenu disabled>Jump to Section</SUI.Submenu>
          <SUI.Divider/>
          <Oak.ActionItem id="oak.saveSection"/>
          <Oak.ActionItem id="oak.createSection"/>
          <Oak.ActionItem id="oak.deleteSection"/>
          <Oak.ActionItem id="oak.renameSection"/>
          <Oak.ActionItem id="oak.duplicateSection"/>
          <SUI.MenuItem disabled>Rearrange Sections...</SUI.MenuItem>
        </Oak.AppMenu>

        <Oak.AppMenu text="Page">
          <Oak.ActionItem id="oak.showFirstPage"/>
          <Oak.ActionItem id="oak.showPreviousPage"/>
          <Oak.ActionItem id="oak.showNextPage"/>
          <Oak.ActionItem id="oak.showLastPage"/>
          <SUI.Divider/>
          <Oak.ActionItem id="oak.startEditingPage"/>
          <Oak.ActionItem id="oak.stopEditingPage"/>
          <SUI.MenuItem disabled>Page Settings...</SUI.MenuItem>
          <SUI.Submenu disabled>Jump to Page</SUI.Submenu>
          <SUI.Divider/>
          <Oak.ActionItem id="oak.savePage"/>
          <Oak.ActionItem id="oak.createPage"/>
          <Oak.ActionItem id="oak.deletePage"/>
          <Oak.ActionItem id="oak.renamePage"/>
          <Oak.ActionItem id="oak.duplicatePage"/>
          <SUI.MenuItem disabled>Rearrange Pages...</SUI.MenuItem>
        </Oak.AppMenu>
      </Oak.FixedPanel>
    );
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: true }, AppMenubar);
