
//////////////////////////////
//	<Divider> component
//////////////////////////////

export default function Divider({ key, className }={}) {
	const props = {
		key,
		className : classNames("divider", className )
	}
	return <div {...props}/>;
}
