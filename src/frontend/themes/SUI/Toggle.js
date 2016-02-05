"use strict";
//////////////////////////////
//
//  <Toggle> component for use with SemanticUI
//
//////////////////////////////

import Checkbox from "./Checkbox";

class SUIToggle extends Checkbox {
  static defaultType = "toggle";
}

// Install us to be created whenever a "Field" specifies `type=toggle`
import { registerFieldType } from "./Field";
registerFieldType("toggle", SUIToggle);


export default SUIToggle;
