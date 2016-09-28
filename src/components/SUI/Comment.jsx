//////////////////////////////
//
//  <Comment> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import ElementBuffer from "./ElementBuffer";

import "./Comment.css";

function SUIComment(props) {
  const {
    text, author, authorLink, metadata, avatar, actions, children,
    appearance,
    // everything else including id, className, style,
    ...extraProps
  } = props;

  const elements = new ElementBuffer({
    props : extraProps
  });
  elements.addClass(appearance, "comment");

  const authorTag = (authorLink ? "a" : "span");

  // add content first
  if (author) elements.appendWrapped(authorTag, { href: authorLink, className: "author" }, author);
  if (metadata) elements.appendWrapped("div", "metadata", metadata);
  if (text) elements.appendWrapped("div", "text", text);
  if (actions) elements.appendWrapped("div", "actions", actions);

  // wrap the above in `div.content`
  if (elements.length) elements.wrap("div", { className: "content" });

  // add avatar before content
  if (avatar) elements.prependWrapped(authorTag, { href: authorLink, className: "avatar" }, <img src={avatar}/>);

  // assume any children are nested comments and just stick them in place
  if (children) elements.append(children);

  return elements.render();
}

SUIComment.defaultProps = {}

SUIComment.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  text: PropTypes.string,       // content text
  avatar: PropTypes.string,     // avatar image url
  author: PropTypes.string,     // author name
  authorLink: PropTypes.string, // link when clicking on author name or avatar
  metadata: PropTypes.string,   // metadata
  actions: PropTypes.any,       // TODO???

  appearance: PropTypes.string,
};

// add render() method so we get hot code reload.
SUIComment.render = Function.prototype;

export default SUIComment;
