"use strict";
//////////////////////////////
//
//  <RadioButton> component for use with SemanticUI
//
//////////////////////////////

import Checkbox from "./Checkbox";

class SUIRadioButton extends Checkbox {
  static defaultType = "radio";
}

// Install us to be created whenever a "Field" specifies `type=radio`
import { registerFieldType } from "./Field";
registerFieldType("radio", SUIRadioButton);


export default SUIRadioButton;
