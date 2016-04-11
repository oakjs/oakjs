"use strict";
//////////////////////////////
//
//  <Link>:  Wrapper for:
//    - page link (props.page)
//    - section link (props.section)
//    - project link (props.project)
//    - react router link (props.to)
//    - arbitrary web link (props.href)
//
//////////////////////////////

import React, { PropTypes } from "react";
import { Link } from "react-router";
import Stub from "./Stub";


export function OakPageLink({ page, label, children, ...linkProps }={}, context) {
  linkProps.to = (typeof page === "string" ? page : page.route);
  const contents = (children || label || page.title);
  return <Link {...linkProps}>{contents}</Link>;
}

export function OakSectionLink({ section, label, children, ...linkProps }={}, context) {
  linkProps.to = (typeof section === "string" ? section : section.route);
  const contents = (children || label || section.title);
  return <Link {...linkProps}>{contents}</Link>;
}

export function OakProjectLink({ project, label, children, ...linkProps }={}, context) {
  linkProps.to = (typeof project === "string" ? project : project.route);
  const contents = (children || label || project.title);
  return <Link {...linkProps}>{contents}</Link>;
}

export function OakRouteLink({ label, children, ...linkProps }={}, context) {
  return <Link {...linkProps}>{label}{children}</Link>;
}

export function OakAnchorLink({ label, children, ...anchorProps } = {}, context) {
  return <a {...anchorProps}>{label}{children}</a>;
}


function OakLink(props, context) {
  if (props.page) return OakPageLink(props, context);
  if (props.section) return OakSectionLink(props, context);
  if (props.project) return OakProjectLink(props, context);
  if (props.to) return OakRouteLink(props, context);
  if (props.href) return OakAnchorLink(props, context);
  return <Stub/>;
}

// Add render function so we hot reload.
OakLink.render = Function.prototype;

export default OakLink;

// Set oak editor prefs
Object.keys(exports).forEach( key => exports[key].editor = { draggable: true, droppable: false } );
