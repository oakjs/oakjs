"use strict";
//////////////////////////////
//
//  <CardLink>:  Wrapper around react-router <Link>
//
//  TODO: if no slashes, stay in the current stack...
//
//////////////////////////////

import React, { PropTypes } from "react";
import { Link } from "react-router";
import Stub from "./Stub";

export default function OakCardLink(props) {
  if (!props.to) return <Stub/>;
  return <Link {...props}/>;
}
