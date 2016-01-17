
//////////////////////////////
//	<MenuHeader> component
//////////////////////////////

export default function MenuHeader({ key, className, icon, label, children }={}) {
	const props = {
		key,
		className : classNames("header", { className : className } )
	}
	if (icon) icon = <Icon icon={icon}/>;
	return <div {...props}> {icon} {label} {children} </div>;
}
