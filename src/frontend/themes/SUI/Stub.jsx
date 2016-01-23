"use strict"
//////////////////////////////
//
//  <Stub> component
//
//////////////////////////////

import React from "react";

const props = {
  className: "Stub",
  style: { display: "none", position: "absolute", left:-100, top:-100, width: 0, height: 0 }
};
const stub = <span {...props}/>;

export default function SUIStub() {
  return stub;
}
