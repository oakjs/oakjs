//////////////////////////////
//
//  Loader for all oak project-ey bits so we get them as instance singletons.
//
//  Use `oak.registry` instance created on system startup, DO NOT INSTANTIATE ON YOUR OWN!
//
//////////////////////////////

import Registry from "oak-roots/Registry";
import LoadableIndex from "oak-roots/LoadableIndex";

import api from "./api";

import Page from "./Page";
import Project from "./Project";
import Section from "./Section";

import OakPage from "./components/OakPage";
import OakProject from "./components/OakProject";
import OakSection from "./components/OakSection";


export default class ProjectRegistry extends Registry {

  constructor(oak) {
    super(...arguments);

    // pointer to our oak singleton
    this.oak = oak;

    // load the projectIndex since that's the first thing we'll need to do
    this.projectIndex = this._makeProjectIndex();
  }

  //////////////////////////////
  //  Indexes
  //////////////////////////////

  // Create the project index on demand.
  // DO NOT CALL THIS!  Use `oak.registry.projectIndex` instead.
  _makeProjectIndex() {
    return new LoadableIndex({
      useOneBasedNumbering: true,
      itemType: "project",
      loadData: () => {
        return api.loadProjectIndex();
      },
      createItem: (projectId, props) => {
        return new Project({
          projectId,
          ...props,
          oak: this.oak,
        });
        this.add(item, registryPath);
      }
    });
  }


  //////////////////////////////
  //  Paths
  //////////////////////////////

  getPath(pathOrController) {
    if (typeof pathOrController === "string") return pathOrController;
    if (pathOrController && pathOrController.path) return pathOrController.path;
    console.warn(`oak.registry.getPath(${pathOrController}): cant figure out path`);
  }

  //////////////////////////////
  //  Projects!
  //////////////////////////////


  // Return a project, but only if it has already been loaded.
  // Returns `undefined` if the project is not found or it hasn't been loaded yet.
  // Use `oak.registry.loadProject()` if you want to ensure that a project is loaded.
  getProject(projectId) {
    return this.projectIndex.getItem(projectId);
  }

  // Return a promise which resolves with a loaded project.
  // If project is not found, the promise will reject.
  // You can specify string id or numeric index.
  loadProject(projectId) {
    return this.projectIndex.loadItem(projectId)
//       .catch(error => {
//         console.group(`Error loading project ${projectId}:`);
//         console.error(error);
//         console.groupEnd();
//         throw new ReferenceError("Couldn't load project");
//       });
  }

  //////////////////////////////
  //  Sections!
  //////////////////////////////

  getSection(projectId, sectionId) {
    const project = this.getProject(projectId);
    if (project) return project.getSection(sectionId);
  }

  loadSection(projectId, sectionId) {
    const section = this.getSection(projectId, sectionId);
    if (section) return section.load();

    return this.loadProject(projectId)
      .then( () => {
        const section = this.getSection(projectId, sectionId);
        if (section) return section.load();
        return Promise.reject(`Section ${sectionId} not found`);
      })
//       .catch(error => {
//         console.group(`Error loading section ${projectId}/${sectionId}:`);
//         console.error(error);
//         console.groupEnd();
//         throw new ReferenceError("Couldn't load section");
//       });
  }


  //////////////////////////////
  //  Pages!
  //////////////////////////////

  getPage(projectId, sectionId, pageId) {
    const section = this.getSection(projectId, sectionId);
    if (section) return section.getPage(pageId);
  }

  loadPage(projectId, sectionId, pageId) {
console.info("loadPage", projectId, sectionId, pageId);
    return this.loadSection(projectId, sectionId)
      .then( () => {
        const page = this.getPage(projectId, sectionId, pageId);
        if (page) return page.load();
        return Promise.reject(`Page ${pageId} not found`);
      })
//       .catch(error => {
//         console.group(`Error loading page ${projectId}/${sectionId}/${pageId}:`);
//         console.error(error);
//         console.groupEnd();
//         throw new ReferenceError("Couldn't load page");
//       });
  }




}
