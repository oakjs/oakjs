// Menu of cards in the current stack.
import React, { PropTypes } from "react";
import classNames from "classnames";

function StackMenu(props, context) {
  const c = context.components;
  const stack = props.stack || context.stack;
  if (!c || !stack) return <Stub/>;

  // pass all other props along
  const menuProps = Object.assign({}, props);
  menuProps.className = classNames("StackMenu", props.className);

  const menuItems = stack.cards.map(card => <c.CardMenuItem card={card}/>);
  return React.createElement(c.Menu, menuProps, ...menuItems);
}

// Pull context in so we can get components and pointer to the current stack.
StackMenu.contextTypes = {
  components: PropTypes.any,
  stack: PropTypes.any
};

// Add render function so we hot reload.
StackMenu.render = Function.prototype;

export default StackMenu;
