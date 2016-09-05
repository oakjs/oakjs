const OakComponent = oak.components.OakComponent;
export default class Bug extends OakComponent {
  render() {
    const { components:c } = this.context;
    return <c.Message icon="small bug" size="small" appearance="error" {...this.props}/>
  }
}
