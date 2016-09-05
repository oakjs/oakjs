const OakComponent = oak.components.OakComponent;
export default class Bug extends OakComponent {
  render() {
    const { SUI } = this.context.components;
    return <SUI.Message icon="small bug" size="small" appearance="error" {...this.props}/>
  }
}
