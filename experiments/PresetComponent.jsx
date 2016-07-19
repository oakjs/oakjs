// Wrap a Component in another class which will initialize static `preset` properties before rendering.
// NOTE: the wrapped component should override `renderWithPresets()`, NOT `render()`.
function PresetComponent(Component) {
	return class PresetComponent extends Component {
		render() {
			return this.renderWithPresets(this.initPresetProps(), this.state, this.context);
		}

		initPresetProps() {
			const presetMap = this.constructor.presets;
			const { preset, otherProps } = this.props;

			const results = Object.assign({}, this.presetMap["default"]);
			if (presets) {
				if (typeof presets === "string") presets = presets.split(",");
				presets.forEach( preset => Object.assign(results, this.getPreset(preset));
			}
			return Object.assign(results, otherProps);
		}
	}
}


// Example class
class someComponent extends PresetComponent(Some.Other.Component) {
	static presets = {
		"default"	: { … },
		"preset1"	: { … },
		"preset2"	: { … },
	}

	renderWithPresets(props, state, context) {
		…
	}
}


constructor(props) {
	if ("preset" in props) {
		const { preset, otherProps } = props;
		const propsWithPresets = Object.assign({}, this.constructor.presets[preset], otherProps);
		super(propsWithPresets);
	}
	else {
		super(props);
	}
}
