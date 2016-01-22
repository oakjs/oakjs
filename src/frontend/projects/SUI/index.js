//////////////////////////////
//
// Project index creator.
// Uses reflection to initialize lots of tasty stuff for this project.
//
// NOTE:  This file is COMPLETELY GENERIC!!!
//
//////////////////////////////
import { Project } from "oak";

// Pull in project components and merge with project components.
import project from "./project";
import * as themeComponents from "./theme";
import * as projectComponents from "./components";
import * as stackMap from "./stacks";

export default Project.initializeProject({ project, themeComponents, projectComponents, stackMap });
