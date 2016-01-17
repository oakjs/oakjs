//////////////////////////////
//
//	<Icon> component for use with SemanticUI
//
//////////////////////////////

export default function SUIIcon( { icon } = {}) {
	if (icon) return <i className={`${icon} icon`}/>;
}
