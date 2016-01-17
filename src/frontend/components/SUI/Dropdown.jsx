"use strict";

//////////////////////////////
//
//	<Dropdown> component for use with SemanticUI
//
//////////////////////////////

import Component from "./Component";

// `appearance`:  any combination of:
//		- `fluid`, `compact`, `large`, `small`
export default class Dropdown extends Component {
	static defaultProps = {
		// visible / enabled
		visible				: true,
		enabled				: true,

		// appearance
		id					: undefined,		// HTML element id
		className			: undefined,		// Arbitrary CSS class name(s)
		showArrow			: false,			// Show dropdown icon to the right?
		appearance			: undefined,		// Any space-delimited combination of:
												//	- `fluid`

		// button characteristics
		title				: undefined,		// Fixed title (doesn't work if we `selectable`?)
		placeholder			: undefined,		// Placeholder text
		icon				: undefined,		// Icon for the dropdown itself.

		// header characteristics
		header				: undefined,		// header text
		headerIcon			: undefined,		// header icon

		// selection
		selectable			: false,			// If `true`, we show selection in the button
		multiSelect			: false,			// If `true`, the item is multi-selectable.
												// NOTE: automatically turns `selectable` on if set.

		// form integration
		name				: undefined,		// If set, we'll include a <input@hidden[name]> for a form.


		// searchability
		searchable			: false,			// If set, they can type to search in the field.

		// programmatic menu items
		items				: undefined,		// Map of items to display.
												// Alternative to having nested <MenuItems/>.
												// Can be:  - delimited string
												//			- array of string or { value, label } maps
												//			- map of { value : label }
		itemDelimiter		: ",",				// Delimiter for a list of string items.

		// event handlers
		onChange			: undefined,
	}


	//////////////////////////////
	//	Lifecycle
	//////////////////////////////

	componentDidMount() {
		this.$ref().dropdown({
			onChange : this.onChange
		});
	}


	//////////////////////////////
	//	Rendering
	//////////////////////////////

	render() {
		const { visible } = this.props;
		if (!visible) return <EmptyStub/>;

		const { id } = this.props;
		const { onChange } = this;
console.warn(onChange);
		const props = {
			id,
			className : this.renderClass()
		};
		return (
			<div {...props}>
				{this.renderHiddenField()}
				{this.renderIcon()}
				{this.renderArrow()}
				{this.renderTextDisplay()}
				{this.renderItemsAndHeader()}
				{this.props.children}
			</div>
		);
	}

	// Render className for our item element.
	renderClass() {
		const { enabled, multiSelect, selectable, fluid, searchable, className, appearance } = this.props;
		return classNames(
			"ui",
			{
				disabled	: !enabled,
				multiple 	: multiSelect,
				selection 	: selectable || multiSelect,
				search		: searchable,
				className
			},
			appearance,
			"dropdown"
		);
	}

	renderHiddenField() {
		const { field } = this.props;
		if (field) return <input type="hidden" name={field}/>;
	}

	renderIcon() {
		const { icon } = this.props;
		if (icon) return <i className={`${icon} icon`}/>;
	}

	renderArrow() {
		const { showArrow } = this.props;
		if (showArrow) return <i className="dropdown icon"/>;
	}

	renderTextDisplay() {
		const { title, placeholder, selectable } = this.props;
		if (!title && !placeholder && !selectable) return;

		let className = "text", displayText = title;
		if (!title && placeholder) {
			className = "default text";
			displayText = placeholder;
		}
		return <div className={className}>{displayText}</div>;
	}

	renderItemsAndHeader() {
		const { items, itemDelimiter, header, headerIcon } = this.props;
		if (!items && !header) return;
		const props = { items, itemDelimiter, header, headerIcon };
		return <SUI.Menu {...props}/>;
	}


	//////////////////////////////
	//	Event handlers
	//////////////////////////////

	// Dropdown value changed.
	onChange(value, textDelta, $textDelta) {
		const { onChange } = this.props;
		if (onChange) onChange(value, textDelta);
	}

	// Item added to multiple select.
	onAdded(addedValue, textDelta, $textDelta) {
		const { onAdded } = this.props;
		if (onAdded) onAdded(value, textDelta);
	}

	// Item added to multiple select.
	onRemove(removedValue, removedText, $textDelta) {
		const { onRemoved } = this.props;
		if (onRemoved) onRemoved(value, textDelta);
	}

}

