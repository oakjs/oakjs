#JSXE Tricks#

##Dynamic Expressions##

- It would be valuable to allow authors to sprinkle dynamic logic in the (essentially static) JSXE file, e.g.
	- `title` which is dependent on the some variable
	- dynamic `hidden` or `disabled` properties (which are globally to all HTML elements)
- While it's possible to code for this, it's tedious (requiring `getRenderProps()` or similar) and most component authors will not think of this
- Since we're always converting JSXE into normal React code, we could turn any dynamic expression in a JSX attribute into a function in the resulting JSX which is evaluated at runtime

###Issues###
- We'll have to start parsing fat arrow expressions (but we need that for Safari anyways)
- Scope? The "natural" scope for the expression is the Page/etc, whereas you often would want it on the nested control.
	- Hoist controls with expressions somehow?
- Variables to pass to the expression?  Can we even get access to the control itself (maybe by hoisting the control definition)?
- How to delimit "function object attribute" vs "dynamic expression" in the JSXE
	- ??? lack of fat arrow means the latter is a dynamic expression???
		- `<Thing onHidden={()=>some.function.call()}/>` vs `<Thing hidden={some.function.call()}/>`
	- ??? use propTypes -- if the attribute doesn't expect a function, assume the value should be evaluated?


##Inlining Scripts & CSS/LESS##
- Sure would be nice to be able to inline script blocks and CSS/LESS directly into a single JSXE file.
- Ideally the script/etc would be scoped to the component immediately above it, e.g.

		<Oak-Page>
			<script>
				... page methods/properties/etc? how to do arbitrary javascript? ...
			</script>
			<css>
				... css scoped to this page ...
			</css>
			<less>
				... less scoped to this page ...
			</less>
			<nested-component>
				<script>...script for the nested component...</script>
			</nested-component>
		</Oak-Page>

- Acorn's JSX parser is likely to fight us in this -- is there a way to say "don't look at the contents of this tag"?


##Parsing Wierdness##

###Controller vs Component###
- `Controller` is the persistent thing that we parse/load/manage/save
- `Component` is dynamically yielded based on current state of the controller
- From the user perspective, they're the same thing -- `oak.page` must be the Controller, but you must mirror Component `refs`, `props`, methods, etc or the end user has to be aware of the different concepts.
- We also have the wierdness of not knowing what props to put on the outer `Page` etc element
- ??? Currently we're just throwing the controller script onto the Component, perhaps we need to parse it and make the mirror work via getters?

###Component Class vs Instance###
- A `.jsxe` file should actually create a new **class**, not an instance?




##Events##
- We're likely to need some dynamic event subscription mechanism
- ????