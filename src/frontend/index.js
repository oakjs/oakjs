"use strict";
//////////////////////////////
//
//  Application starter file.
//  Load and initialize the router, through the magic of webpack, this will load all of our code.
//
//////////////////////////////

import React from "react";
import ReactDOM from "react-dom";

import Router from "./Router";
ReactDOM.render(Router, document.getElementById("OakPlayer"));
