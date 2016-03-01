export default class Bug extends oak.components.OakComponent {
  render() {
    const { components:c } = this.context;
    return <c.Message icon="small bug" size="small" appearance="error" {...this.props}/>
  }
}
