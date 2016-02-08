//////////////////////////////
//
//	<FeedEvent> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import ElementBuffer from "./ElementBuffer";
import Icon from "./Icon";

import "./Feed.css";

function SUIFeedEvent(props) {
  const {
    author, authorLink,
    summary, date, dateOn, meta, icon, avatar, children,
    appearance,
    // everything else including id, className, style,
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props : extraProps
  });
  elements.addClass(appearance, "event");


  // add author/summary/date first
  const authorTag = (authorLink ? "a" : "span");
  if (author) {
    elements.appendWrapped(authorTag, { href: authorLink, className: "user"}, author);
    // grr... we have to add a space manually or the content will run together
    if (summary) elements.append(<span> </span>);
  }
  if (summary) elements.append(summary);

  // if date and date IS NOT on top, add INSIDE the summary
  const dateElement = date ? elements.createWrapped("div", "date", date) : undefined;
  if (date && dateOn !== "top") elements.append(dateElement);

  // wrap above in `div.summary`
  elements.wrap("div", "summary");

  // if date and date IS on top, add OUTSIDE the summary
  if (date && dateOn === "top") elements.prepend(dateElement);

  // add children, which we assume is "extra stuff"
  // TODO: should we wrap the children???
  if (children) elements.append(children);

  // add meta after children
  if (meta) elements.appendWrapped("div", "meta", meta);

  // wrap that entire thing in `div.content`
  if (elements.length) elements.wrap("div", "content");

  // add avatar or icon
  if (avatar) elements.prependWrapped(authorTag, {href: authorLink, className: "label" }, <img src={avatar}/>);
  else if (icon) elements.prependWrapped("div", "label", <Icon icon={icon}/>);

  return elements.render();
}

SUIFeedEvent.defaultProps = {}

SUIFeedEvent.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  author: PropTypes.string,     // Name of author
  authorLink: PropTypes.string, // Author link url

  summary: PropTypes.any,       // text label or nested elements
  icon: PropTypes.string,       // icon
  avatar: PropTypes.string,     // avatar image url
  meta: PropTypes.any,          // nested meta content
  date: PropTypes.string,       // date label
  dateOn: PropTypes.string,     // "top" or "right"

  children: PropTypes.any,      // extra stuff to go inside the item

  appearance: PropTypes.string,
};

// add render() method so we get hot code reload.
SUIFeedEvent.render = Function.prototype;

export default SUIFeedEvent;
