//////////////////////////////
//  Actions for resizing via <SelectionOverlay> and <Resizer> and friends.
//////////////////////////////
"use strict";

import { die,  } from "oak-roots/util/die";
import { UndoTransaction } from "oak-roots/UndoQueue";

import oak from "../oak";

import utils from "./utils";


export const resize = {

  // Set to true to debug resize events
  _debug: false,


  //////////////////////////////
  //  Tracking mouse in <Resizer>
  //////////////////////////////

  onResizerDown: function(event) {
    console.info("onRezierDown", event);
  },




}


// Export all as a lump
export default Object.assign({}, exports);
