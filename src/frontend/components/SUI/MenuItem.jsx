"use strict"
//////////////////////////////
//
//	<MenuItem> component for use with SemanticUI
//
//////////////////////////////

import Icon from "./Icon";
import MenuHeader from "./MenuHeader";
import Divider from "./Divider";

// `appearance`:  any combination of:
//		- `fitted`, `horizontally fitted`, `vertically fitted`
//		- `inverted`, `red`, `blue`, etc
//		-
export default function MenuItem({ key, appearance, value, label, active, disabled, icon, className, children } = {}) {

	// If label starts with "-", return a Header instead
	if (value === undefined && label[0] === "#") return MenuHeader({ key, label:label.substr(1), icon, className, children });

	// if it's all dashes, make a separator instead
	if (value === undefined && /^-+$/.test(label))	return Divider({key});

	if (!value) value = label;

	const props = {
		key,
		active,
		"data-value" 	: value,
		"data-text"		: label,
		className		: classNames(appearance, {disabled, className}, "item")
	}
	if (icon) icon = <Icon icon={icon}/>;

	return <div {...props}> {icon} {label} {children} </div>;
}

