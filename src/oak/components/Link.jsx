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
import { Link as RouterLink } from "react-router";
import Stub from "./Stub";


export function PageLink({ page, label, children, ...linkProps }={}, context) {
  linkProps.to = (typeof page === "string" ? page : page.route);
  const contents = (children || label || page.title);
  return <RouterLink {...linkProps}>{contents}</RouterLink>;
}

export function SectionLink({ section, label, children, ...linkProps }={}, context) {
  linkProps.to = (typeof section === "string" ? section : section.route);
  const contents = (children || label || section.title);
  return <RouterLink {...linkProps}>{contents}</RouterLink>;
}

export function ProjectLink({ project, label, children, ...linkProps }={}, context) {
  linkProps.to = (typeof project === "string" ? project : project.route);
  const contents = (children || label || project.title);
  return <RouterLink {...linkProps}>{contents}</RouterLink>;
}

export function RouteLink({ label, children, ...linkProps }={}, context) {
  return <RouterLink {...linkProps}>{label}{children}</RouterLink>;
}

export function AnchorLink({ label, children, ...anchorProps } = {}, context) {
  return <a {...anchorProps}>{label}{children}</a>;
}


function Link(props, context) {
  if (props.page) return PageLink(props, context);
  if (props.section) return SectionLink(props, context);
  if (props.project) return ProjectLink(props, context);
  if (props.to) return RouteLink(props, context);
  if (props.href) return AnchorLink(props, context);
  return <Stub/>;
}

// Oak editor prefs
import DragProps from "oak/DragProps";
DragProps.register("Oak", { draggable: true, droppable: false }, exports);

export default Link;
