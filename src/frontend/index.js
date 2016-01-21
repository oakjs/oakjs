"use strict";
//////////////////////////////
//
//  Application starter file.
//  Load and initialize the router, through the magic of webpack, this will load all of our code.
//
//////////////////////////////

import React from "react";
import ReactDOM from "react-dom";

import AppRouter from "./AppRouter";
ReactDOM.render(<AppRouter/>, document.getElementById("OakPlayer"));
