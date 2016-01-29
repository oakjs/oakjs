//////////////////////////////
//
//	<Statistic> component for use with SemanticUI
//
//////////////////////////////

import React, { PropTypes } from "react";

import ElementBuffer from "./ElementBuffer";
import { getFloatedClass } from "./constants";

function SUIStatistic(props) {
  const {
    children,
    value, label, labelOn,
    icon, image, imageAppearance,
    appearance, color, size, floated, decorationOn,
    // everything else including id, className, style,
    ...otherProps
  } = props;

  const elements = new ElementBuffer({
    props : otherProps
  });
  elements.addClass("ui", appearance, size, color, getFloatedClass(floated), "statistic");

  // if they specify children, just include them rather than messing with attributes
  if (children) {
    elements.append(children);
  }
  else {
    elements.append(value);

    // add decoration if specified
    if (image || icon) {
      let decoration;
      if (image) decoration = elements.createImage(image, imageAppearance);
      else if (icon) decoration = elements.createIcon(icon);

      if (decoration) {
        // grrr... we have to manually add a space
        if (decorationOn === "left") elements.prepend(decoration, <span> </span>);
        else elements.append(<span> </span>, decoration);
      }
    }

    // wrap value and decoration
    elements.wrap("div", "value");

    // add label
    if (label) {
      const labelElement = elements.createWrapped("div", "label", label);
      const side = (labelOn === "top" || labelOn === "left" ? "left" : "right");
      elements.addOn(side, labelElement);
    }
  }
  return elements.render();
}

SUIStatistic.defaultProps = {
  decorationOn: "left"
}

SUIStatistic.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,

  value: PropTypes.string,        // value
  label: PropTypes.string,        // label text
  labelOn: PropTypes.string,      // "top", "bottom", "left" or "right"

  icon: PropTypes.string,         // icon
  image: PropTypes.string,        // image
  imageAppearance: PropTypes.string, // ...
  decorationOn: PropTypes.string, // "left" or "right"

  appearance: PropTypes.string,   // "horizontal", "inverted"
  color: PropTypes.string,
  size: PropTypes.string,         // "mini", "tiny", "small", "medium", "large", "huge"
  floated: PropTypes.string,      // "left" or "right"
};

// add render() method so we get hot code reload.
SUIStatistic.render = Function.prototype;

export default SUIStatistic;
