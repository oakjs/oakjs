//////////////////////////////
//
//  Loader for all oak project-ey bits so we get them as instance singletons.
//
//  Use `oak.loader` instance created on system startup, DO NOT INSTANTIATE ON YOUR OWN!
//
//////////////////////////////

import Registry from "oak-roots/Registry";
import LoadableIndex from "oak-roots/LoadableIndex";

import api from "./api";

import ComponentLoader from "./ComponentLoader";
import Page from "./Page";
import Project from "./Project";
import Section from "./Section";

import OakPage from "./components/OakPage";
import OakProject from "./components/OakProject";
import OakSection from "./components/OakSection";


export default class ProjectLoader extends Registry {

  constructor(oak) {
    super(...arguments);

    // pointer to our oak singleton
    this.oak = oak;

    // load the projectIndex since that's the first thing we'll need to do
    this.projectIndex = this.getProjectIndex();
    this.projectIndex.load();
  }

  //////////////////////////////
  //  Indexes
  //////////////////////////////

  _getFromRegistry(typePrefix, pathOrController, creatorFunction) {
    const registryPath = typePrefix + (typeof pathOrController === "string" ? pathOrController : pathOrController.path);
    let item = this.get(registryPath);
    if (!item && creatorFunction) {
      item = creatorFunction.call(this, pathOrController);
      item.oak = this.oak;
      item._registryPath = registryPath;
      this.add(item, registryPath);
    }
    return item;
  }

  // Return the one and only project index singleton.
  getProjectIndex() {
    return this._getFromRegistry("PROJECTS:", "", this._makeProjectIndex);
  }

  // Create the project index on demand.
  // DO NOT CALL THIS!  Use `oak.loader.projectIndex` instead.
  _makeProjectIndex() {
    return new LoadableIndex({
      itemType: "project",
      loadIndex: () => {
        return api.loadProjectIndex();
      },
      createItem: (projectId, props) => {
        return new Project({
          projectId,
          ...props,
          oak: this.oak,
        });
      },
    });
  }


  // Return the section index singleton for a specific project.
  getSectionIndex(projectPath) {
    return this._getFromRegistry("STACK-INDEX:", projectPath, this._makeSectionIndex)
  }

  // Create a section index on demand.
  // DO NOT CALL THIS!  Use `oak.loader.getSectionIndex()` instead.
  _makeSectionIndex(projectPath) {
    const projectId = projectPath;
    return new LoadableIndex({
      itemType: "section",
      loadIndex: () => {
        return api.loadSectionIndex(projectPath);
      },
      createItem: (sectionId, props) => {
        return new Section({
          sectionId,
          projectId,
          ...props,
          oak: this.oak,
        });
      }
    });
  }


  // Return the page index singleton for a specific section.
  getPageIndex(sectionPath) {
    return this._getFromRegistry("CARD-INDEX:", sectionPath, this._makePageIndex)
  }

  // Create a page index on demand.
  // DO NOT CALL THIS!  Use `oak.loader.getPageIndex()` instead.
  _makePageIndex(sectionPath) {
    const [ projectId, sectionId ] = sectionPath.split("/");
    return new LoadableIndex({
      itemType: "page",
      loadIndex: () => {
        return api.loadPageIndex(sectionPath);
      },
      createItem: (pageId, props) => {
        return new Page({
          pageId,
          sectionId,
          projectId,
          ...props,
          oak: this.oak,
        });
      }
    });
  }


  //////////////////////////////
  //  Loaders
  //////////////////////////////

  getPath(pathOrController) {
    if (typeof pathOrController === "string") return pathOrController;
    if (pathOrController && pathOrController.path) return pathOrController.path;
    console.warn(`oak.loader.getPath(${pathOrController}): cant figure out path`);
  }

  getLoader(pathOrController, makeIfNecessary) {
    if (pathOrController instanceof ComponentLoader) return pathOrController;

    const path = this.getPath(pathOrController);
    if (!path) return;
    const [ projectId, sectionId, pageId ] = path.split("/");
    if (pageId) return this.getPageLoader(pathOrController, makeIfNecessary);
    if (sectionId) return this.getSectionLoader(pathOrController, makeIfNecessary);
    return this.getProjectLoader(pathOrController, makeIfNecessary);
  }

  // Return the singleton loader for some project.
  getProjectLoader(project, makeIfNecessary) {
    const makeLoader = makeIfNecessary && project instanceof Project && this._makeProjectLoader;
    return this._getFromRegistry("PROJECT-LOADER:", project, makeLoader);
  }


  // Create a project loader on demand.
  // DO NOT CALL THIS!  Use `oak.loader.getProjectLoader()` instead.
  _makeProjectLoader(project) {
    return new ComponentLoader({
      type: "Project",
      path: project.path,
      controller: project,
      SuperConstructor: OakProject
    });
  }

  // Return the singleton loader for some section.
  getSectionLoader(section, makeIfNecessary) {
    const makeLoader = makeIfNecessary && section instanceof Section && this._makeSectionLoader;
    return this._getFromRegistry("STACK-LOADER:", section, makeLoader);
  }

  // Create a section loader on demand.
  // DO NOT CALL THIS!  Use `oak.loader.getSectionLoader()` instead.
  _makeSectionLoader(section) {
    return new ComponentLoader({
      type: "Section",
      path: section.path,
      controller: section,
      SuperConstructor: OakSection
    });
  }

  // Return the singleton loader for some page.
  getPageLoader(page, makeIfNecessary) {
    const makeLoader = makeIfNecessary && page instanceof Page && this._makePageLoader;
    return this._getFromRegistry("CARD-LOADER:", page, makeLoader);
  }

  // Create a page loader on demand.
  // DO NOT CALL THIS!  Use `oak.loader.getPageLoader()` instead.
  _makePageLoader(page) {
    return new ComponentLoader({
      type: "Page",
      path: page.path,
      controller: page,
      SuperConstructor: OakPage
    });
  }



  //////////////////////////////
  //  Projects!
  //////////////////////////////


  // Return a project, but only if it has already been loaded.
  // Returns `undefined` if the project is not found or it hasn't been loaded yet.
  // Use `oak.loader.loadProject()` if you want to ensure that a project is loaded.
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
