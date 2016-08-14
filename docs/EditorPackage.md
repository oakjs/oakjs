#Oak "Editor" Component Package

##High-level goals:
- Quickly & simply create editor for a complex, nested Javascript object
- An Editor manipulates an in-memory javascript object which may or may not be saved via a HTML "SUBMIT" process
- Client + server validation
- Doesn’t require Semantic UI
- Lightweight components for simple control types (Text, Integer, Checkbox, etc)
- Easy to work with arbitrary components (via `<Editor-Control>` wrapper)
- `<Editor-Repeat>` control for arbitrary-length arrays of nested objects
- Form layout is easy via 16-column grid


##Sample
	<Editor-Form data={user.profile} immediate>
		<!-- non-required select automatically adds empty option -->
		<Editor-Select name=“salutation” values=[“Mr.”,”Mrs.”,”Ms”,”Miss”]/>
		<Editor-Text name=“name.first” title=“First Name” required max={50} />
		<Editor-Text name=“name.last” title=“Last Name” required max={50} />
		<Editor-Integer name=“age” min={0} />
		<Editor-Text name=“quote” multiLine …/>
		<Editor-Repeat title=“Address(es)” name=“addresses” max=5>
			<-- creates up to 5 of this nested form, one for each adddress in addresses -->
			<AddressForm/>
		</Editor.Repeat>
		<Editor-Repeat title=“Phone(s)” name=“phone”>
			<-- set of nested components will be created for each object in ‘phone’ array -->
			<Editor.Select name=“type” values=[“…”]/>
			<Editor.Text name=“number”/>		
		</Editor-Repeat>
		<Editor-Control field=“friends”>
			<-- auto-inject `value`, `onChange` etc to arbitrary React component -->
			<FriendsList/>
		</Editor-Control>
	</Editor-Form>


##<Editor.Form>
- Form wrapper element.  Manages @data and passes it down to nested `<Editor.Control>`s.

###Properties:
- @data = data object we're operating on
- @immediate = save into the data object as you go (vs. a `save` action)
- @save = function to execute on save — oak ACTION???
- @labelOn *values:[ “hide” | “top” | “left” | “right” ]* = where do title labels go?  (default for fields which don’t specify)
- @errorOn *values:[ “top” | “bottom” ]* = where do error messages go?  (default for fields which don’t specify)
- @onChange = function to execute as ANY field changes
- @onFocus = function to execute when field is focused
- @onBlur = function to execute when field is blurred
- @onKeyPress = function to execute when key is pressed in any field

###State
- @@errors = map of `{ “field.name” => error(s) }` for that field
- @@focused = pointer to the `<Editor.Control>` which is currently focused

###API Methods
- `get(“nested.field.name”)` = return current value of `form.data.nested.field.name` or `undefined` if path is not valid
- `set(“nested.field.name”, value)` = set value and update form.  Auto-called from `form.onChange()`.

###Perhaps ???
- `select(“nested.field.name”)` = explicit select some field in the form
- `formData` context (useful for passing to sub-forms or repeats, etc )
- @autoFocus [ true = first field, “…” or fn = field name] = auto focus when form is shown
- @state [“loading”, “error”, “saving”, “saved”] = current state of the form
- @mode [“new”, “edit”] = which mode are we in (UI often changes between the states)
- @autoSave = automatically save when form hidden or on delay
- @schema = schema object ???  this could include titles, validators, etc which will be passed to <field>s
- @dateFormat

---

##<Editor.Control>
- Wrapper for managed input controls provided by the system.
- You can nest an arbitrary React Component inside and they will be managed with @value, @onChange, @disabled, @required, etc.
- Many simple types are provided, eg:
	- `<Output>`, `<Text>`, `<Integer>`, `<Decimal>`, `<Date>`, `<Select>`, `<Checkbox>`, `<Button>`, `<Save>`, `<Cancel>`, `<Clear>`, etc
	- `<Group>` = field group, @title, @inline, @nested, @count for equal sized fields
	- `<Label field=“…”/>` = arbitrarily-placed label, respects matching field's hidden/disabled/etc
	- `<Repeat>` = repeat sub-form or fields for each item in an array, auto-adds “add” and “remove” buttons.  @ordered, @primary, @min, @max
	- `<Image>` = display image (w/ auto-thumbnail support?)
	- `<FileUpload>` = nice upload UI to temp directory, gets back a file identifier that the server can move into place. @multiple, @types

###Properties
- @id = id of the WRAPPER element
- @className = class name of the WRAPPER element
- @style = style object for the WRAPPER element
- @defaultValue = explicit default value
- @value = explicit value, may be overwritten with @name and/or @getDisplayValue
- @name = auto-binding of (possibly nested) property from `context.formData`.  Sub-fields will see only this local data. (???)
- @getDisplayValue = function which yields dynamic display value
- @hidden = boolean or `function(value, form)`:  if `true` we skip rendering the control entirely
- @disabled = boolean or `function(value, form)`
- @required = boolean or `function(value, form)`
- @label = string or `function(value, form)`:  label to show next to the field
- @labelOn *values: [ “top”, “left”, “right”]* = where to show the label.  defaults to `form@labelOn`
- @labelProps = arbitrary props for the label element.
- @hint = string or `function(value, form)`:  hint text to show below the field
- @hintProps = arbitrary props for the hint label.
- @inline = if `true`, element is `display: inline-block`
- @width = number of 16-based columns to take up.  **TODO: How does this interact with labels?**
- @error = current error message(s) to display
- @errorOn *values: [ “top” | “bottom” ]* = where do error messages go?   defaults to `form@errorOn`
- @errorProps = arbitrary props for the error element.
- @onChange = code to fire on input change
- @onFocus = code to fire on focus
- @onBlur = code to fire on blur
- @onKeyPress = code to fire on key press when focused
- @placeholder = placeholder text inside the field, as string or function
- @tabIndex = tab index for control
- @controlProps = arbitrary props to pass to the inner control component

###Perhaps ???
- pass all unknown properties directly on the `<Editor.Control>` to the control element?
- @hintOn [ “bottom”, “right”, “icon” ]?
- @next = field @name (or function to return @name) of next field to focus when exiting this field?
- @validation = ???
	

---
##Groups
- Groups can be used for visual nesting
- Groups can also be used for passing a subset of data down to children
- 


---

##Open Questions
- form `data` to `value` -- this might make more sense for nested fields, etc
- <Editor-Hint> component?
- <Editor-Error> component?
- form `errors` prop vs state and initial rendering without error?
- @options vs @values for select?
- validation methodology?
- what grid model for complex styling?  16-column grid?  20?
- use HTML "hidden" attribute to actually hide (will require CSS support for interaction with `display`)
- external toolbar display / management?
- “watchData” to auto-hookup save/cancel buttons to data `state`?




---
##Super nice to have
- Read in React propTypes and auto-create a form for a component
	- monkey-patch PropType functions to add annotations?
	- one time shot via copy and paste code block to create starter form?



---
##Buggy Things to Work Out
- @labelOn - doesn't automagically work with inline, want to force checkbox / radio to always be to the right
- @labelProps etc at the form level?




##Eric Notes
- Schema interaction:
	- form itself can have an associated schema (eg: JSONSchema, PropTypes, SimpleSchema, etc)
	- this schema can be used to auto-create fields
		- do this as a one-shot deal which creates a oak composite component that you can manipulate		- nice to have a re-do which keeps customizations you've made on the last round
		- external schema spec which we can go to/from the above, with possible JSXE representation
	- does each form NEED to have a schema?
		- auto-create a schema as we're creating the form (and save it where???)
	- "locked" (PropTypes) vs "unlocked" (ad-hoc) schema
	- data editor has same characteristic -- "locked" (API) vs "unlocked" (user-created) data
	
	- proposal:
		- form can OPTIONALLY have an "oak schema" associated with it
		- any named control in the form will automatically pick up the following from the schema, if present:
			- type
			- required
			- isValid()
			- visible
			- enabled
			- values (for enums)
			- permissions / roles
		- relation between "oak schema" and "source schema" is effectively one-way with reconciliation
		- validation happens at form level, but the "onChange()" gets passed pointer to the field in question
			- use @ref on each child for entire-form-at-once level validation