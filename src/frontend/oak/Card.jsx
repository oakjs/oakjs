import React, { PropTypes } from "react";

import OakComponent from "./OakComponent";

class Card extends OakComponent {
  static propTypes = Object.assign({}, OakComponent.propTypes, {
    // card-specific props
//    project: PropTypes.element.isRequired,
  //  stack: PropTypes.element.isRequired,
    template: PropTypes.string
  });

  static defaultProps = Object.assign({}, OakComponent.defaultProps, {
    // card-specific props
  });

  //////////////////////////////
  // Rendering
  //////////////////////////////

  // Tack `Card` on the beginning of our css class name.
  renderClassName() {
    const className = super.renderClassName();
    return `Card ${className}`;
  }


  render() {
console.warn(this.props.project);
console.warn(this.props.stack);
    const { id } = this.props;
    const props = {
      id,
      className: this.renderClassName(),
      style: this.renderStyle()
    }
    return (
      <div {...props}>{this.renderChildren()}</div>
    )
  }

}
export default Card;
