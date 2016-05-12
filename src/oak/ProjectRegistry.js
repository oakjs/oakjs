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
        // There can be only one.
        const registryPath = projectId;
        let item = this.get(registryPath);

        if (!item) {
          item = new Project({
            projectId,
            ...props,
            oak: this.oak,
          });
          this.add(item, registryPath);
        }

        return item;
      },
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
  getProject(projectIdentifier) {
    return this.projectIndex.getItem(projectIdentifier);
  }

  // Return a promise which resolves with a loaded project.
  // If project is not found, the promise will reject.
  // You can specify string id or numeric index.
  loadProject(projectIdentifier) {
    return this.projectIndex.loadItem(projectIdentifier)
//       .catch(error => {
//         console.group(`Error loading project ${projectIdentifier}:`);
//         console.error(error);
//         console.groupEnd();
//         throw new ReferenceError("Couldn't load project");
//       });
  }

  //////////////////////////////
  //  Sections!
  //////////////////////////////

  getSection(projectIdentifier, sectionIdentifier) {
    const project = this.getProject(projectIdentifier);
    if (project) return project.getSection(sectionIdentifier);
  }

  loadSection(projectIdentifier, sectionIdentifier) {
    const section = this.getSection(projectIdentifier, sectionIdentifier);
    if (section) return section.load();

    return this.loadProject(projectIdentifier)
      .then( project => {
        return project.loadSection(sectionIdentifier);
      })
//       .catch(error => {
//         console.group(`Error loading section ${projectIdentifier}/${sectionIdentifier}:`);
//         console.error(error);
//         console.groupEnd();
//         throw new ReferenceError("Couldn't load section");
//       });
  }


  //////////////////////////////
  //  Pages!
  //////////////////////////////

  getPage(projectIdentifier, sectionIdentifier, pageIdentifier) {
    const section = this.getSection(projectIdentifier, sectionIdentifier);
    if (section) return section.getPage(pageIdentifier);
  }

  loadPage(projectIdentifier, sectionIdentifier, pageIdentifier) {
    const page = this.getPage(projectIdentifier, sectionIdentifier, pageIdentifier);
    if (page) return page.load();

    return this.loadSection(projectIdentifier, sectionIdentifier)
      .then( section => {
        return section.loadPage(pageIdentifier);
      })
//       .catch(error => {
//         console.group(`Error loading page ${projectIdentifier}/${sectionIdentifier}/${pageIdentifier}:`);
//         console.error(error);
//         console.groupEnd();
//         throw new ReferenceError("Couldn't load page");
//       });
  }




}
