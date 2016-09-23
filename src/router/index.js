"use strict";
//////////////////////////////
//
//  Application starter file.
//  Load and initialize the router, through the magic of webpack, this will load all of our code.
//
//////////////////////////////

import React from "react";
import ReactDOM from "react-dom";

// load entire oak framework
import oak from "../oak";

// load install-level components
import components from "../components";

import Router from "./Router";
window.ROOT = ReactDOM.render(Router, document.getElementById("OakPlayer"));
