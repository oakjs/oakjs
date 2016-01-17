"use strict";
//////////////////////////////
//
//	<MenuItems> component for use with SemanticUI
//
//////////////////////////////

import Icon from "./Icon";
import MenuItem from "./MenuItem";
import MenuHeader from "./MenuHeader";
import Divider from "./Divider";

// `appearance`:  Any space-delimited combination of:
//		- `fluid`, `compact`, `large`, `small`
//		- `text`, `icon`, `labeled icon`
//		- `tabular`, `pointing`, `attached` `top attached`, `bottom attached`
//		- `vertical`, `two item`, `three item`, etc
//		- `borderless`, `secondary`, `inverted`, `red`, `green`, etc
//		- `stackable`, `top fixed`, `left fixed`, etc
export default function Menu({ appearance, className, disabled, items, itemDelimiter, header, headerIcon, children } = {}) {
	const props = {
		className 	: classNames(appearance, { className, disabled }, "menu" )
	}
	if (items) items = Menu.renderItems({items, itemDelimiter});
	if (header) header = Menu.Header({label:header, icon:headerIcon});
	return (
		<div {...props}>
			{header}
			{items}
			{children}
		</div>
	);
}

// Static methods for parsing and creating items from JS structures.
Object.assign(Menu, {

	// Render a <menu> and list of items.
	renderMenu(props) {
		const items = Menu.renderItems(props);
		if (items) return <div className="menu">{items}</div>;
	},

	// Render a set of items as:
	//	- a delimited string list
	//	- an array of `string` or `{value, label}` pairs
	//	- a map of `{value:label}`.
	// Returns an array of MenuItem or MenuHeaders etc.
	renderItems({ items, itemDelimiter="," }={}) {
		if (!items) return;

		if (typeof items === "string") items = items.split(itemDelimiter);

		if (Array.isArray(items)) {
			return this.renderItemsArray(items)
		}
		return this.renderItemsMap(items);
	},

	renderItemsArray(items) {
		return items.map( (item, key) => {
			if (!item) return;
			if (typeof item === "string") return MenuItem({key, label:item});
			return MenuItem(item);
		}).filter(Boolean);
	},

	// Render an item from a single string value.
	renderStringItem(label, key) {
		// if it's all dashes, make a separator
		if (/^-+$/.test(label))	return Divider({key});

		// if it starts with "#", make a header
		if (label[0] === "#") return MenuHeader({key, label:label.substr(1)});

		return MenuItem({key, label, value:label });
	},

	renderItemsMap(itemsMap) {
		return Object.keys(itemsMap).map( (value, key) => {
			const label = itemsMap[value];
			return MenuItem({key, value, label});
		}).filter(Boolean);
	},
});

