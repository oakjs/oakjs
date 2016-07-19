
export default class Card extends oak.Card {
	// Arbitrary meta data added to this card.
	// WHAT GOES HERE?
	static data = { ... }

	// Render card contents
	//	- `props` 	is normal react instance `props` (filtered through template?)
	//	- `state` 	is `react.state` including
	//	- `meta`  	is static meta data provided above (???)
	//	 OR	`data`	merge of props + state + meta ????  component writer shouldn't have to care...
	//	- `parent`	is our parent object (generally a stack, may be different if nested... ?)
	//	- `project` is the project we're currently displaying in
	//	- `stack`	is the stack we're currently displaying in
	renderLayout( { card, template, project, stack } ) { return (
		<Card>
			<Template from="$templates/someTemplateName">
				<Region id="ABC" visible="false"/>
				<Region id="XYZ" value="card overriden field value"/>
				<Region id="123" source={card.otherField}/>
			</Template>

source vs input / output vs value vs default

			<Region id="ZZZ" name="bar" source={card.bar}/>				<-- 2-way data binding to {card.bar}
			<Region id="AAA" name="foo" source={card.someField}/>		<-- 2-way data binding another card slot (CONFUSING)
			<Region id="EEE" name="baz" source={project.someField}/>	<-- 2-way data binding to project data slot
			<Region id="BBB" name="bar" default={project.title}/>		<-- 1-way data binding from project data.title
			<Region id="CCC" name="baz" value="card value"/>			<-- static value
			<Button id="DDD" action="SUBMIT_FORM"/>
		</Card>
	)}

}
