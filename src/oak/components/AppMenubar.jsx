//////////////////////////////
//  Menubar for the entire app.
//  TODO: the actual <AppMenu> contents should come from project component...
//  TODO: allow runner project/section/page to add menus & menuItems
//////////////////////////////

import React, { PropTypes } from "react";
import { classNames } from "oak-roots/util/react";

import OakComponent from "./OakComponent";

export default class AppMenubar extends OakComponent {
  render() {
    if (this.hidden) return null;
    const { oak, components } = this.context;
    const { Oak, SUI } = components;
    // NOTE: Zindex MUST be above the <EditorToolbar> and <SelectionSidebar>
    return (
      <div style={{ whiteSpace: "nowrap" }}>
        <Oak.AppMenu text="OakJS">
          <SUI.MenuItem disabled label="About OakJS"/>
          <SUI.MenuItem disabled label="Get Help"/>
        </Oak.AppMenu>

        <Oak.AppMenu text="File">
          <Oak.ActionItem id="oak.navigateTo" props={{ route: "/", title:"Open Project..." }}/>
          <SUI.Submenu disabled label="Open Recent..."/>
          <Oak.ActionItem id="oak.navigateTo" props={{ route: "/", title:"Close Project" }}/>
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
          <SUI.MenuItem disabled label={`Project: “${oak.project && oak.project.title}”`} hidden={!oak.project}/>
          <SUI.MenuItem disabled label="Project Settings..." hidden={!oak.project}/>
          <Oak.ActionItem id="oak.saveProject" hidden={!oak.project}/>
          <Oak.ActionItem id="oak.startEditingProject" hidden={!oak.project}/>
          <Oak.ActionItem id="oak.stopEditingProject" hidden={!oak.project}/>
          <SUI.Divider hidden={!oak.project}/>
          <Oak.ActionItem id="oak.createProject"/>
          <Oak.ActionItem id="oak.deleteProject"/>
          <Oak.ActionItem id="oak.renameProject"/>
          <Oak.ActionItem id="oak.duplicateProject"/>
          <SUI.Divider hidden={oak.projectCount < 2}/>
          <SUI.Submenu label="Show Project:" hidden={oak.projectCount < 2}>
            <Oak.ProjectMenu publicOnly={false} checkSelected={true}/>
          </SUI.Submenu>
        </Oak.AppMenu>

        <Oak.AppMenu text="Section" hidden={!oak.section}>
          <SUI.MenuItem disabled label={`Section: “${oak.section && oak.section.title}”`}/>
          <SUI.MenuItem disabled label="Section Settings..."/>
          <Oak.ActionItem id="oak.saveSection"/>
          <Oak.ActionItem id="oak.startEditingSection"/>
          <Oak.ActionItem id="oak.stopEditingSection"/>
          <SUI.Divider/>
          <Oak.ActionItem id="oak.createSection"/>
          <Oak.ActionItem id="oak.deleteSection"/>
          <Oak.ActionItem id="oak.renameSection"/>
          <Oak.ActionItem id="oak.duplicateSection"/>
          <SUI.MenuItem disabled label="Rearrange Sections..."/>
          <SUI.Divider hidden={oak.sectionCount < 2} />
          <SUI.Submenu label="Show Section:" hidden={oak.sectionCount < 2}>
            <Oak.SectionMenu publicOnly={false} checkSelected={true}/>
          </SUI.Submenu>
          <SUI.Divider hidden={oak.sectionCount < 2} />
          <Oak.ActionItem id="oak.showFirstSection"/>
          <Oak.ActionItem id="oak.showPreviousSection"/>
          <Oak.ActionItem id="oak.showNextSection"/>
          <Oak.ActionItem id="oak.showLastSection"/>
        </Oak.AppMenu>

        <Oak.AppMenu text="Page" hidden={!oak.page}>
          <SUI.MenuItem disabled label={`Page: “${oak.page && oak.page.title}”`}/>
          <SUI.MenuItem disabled label="Page Settings..."/>
          <Oak.ActionItem id="oak.savePage"/>
          <Oak.ActionItem id="oak.startEditingPage"/>
          <Oak.ActionItem id="oak.stopEditingPage"/>
          <SUI.Divider/>
          <Oak.ActionItem id="oak.createPage"/>
          <Oak.ActionItem id="oak.deletePage"/>
          <Oak.ActionItem id="oak.renamePage"/>
          <Oak.ActionItem id="oak.duplicatePage"/>
          <SUI.MenuItem disabled label="Rearrange Pages..."/>
          <SUI.Divider hidden={oak.pageCount < 2}/>
          <SUI.Submenu label="Show Page:" hidden={oak.pageCount < 2}>
            <Oak.PageMenu publicOnly={false} checkSelected={true}/>
          </SUI.Submenu>
          <SUI.Divider hidden={oak.pageCount < 2}/>
          <Oak.ActionItem id="oak.showFirstPage"/>
          <Oak.ActionItem id="oak.showPreviousPage"/>
          <Oak.ActionItem id="oak.showNextPage"/>
          <Oak.ActionItem id="oak.showLastPage"/>
        </Oak.AppMenu>
      </div>
    );
  }
}

// Oak editor prefs
import { editify } from "../EditorProps";
editify({ draggable: false, droppable: true }, AppMenubar);
