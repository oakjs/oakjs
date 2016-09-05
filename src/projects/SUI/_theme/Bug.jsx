const { OakComponent } = oak.components.Oak;
export default class Bug extends OakComponent {
  render() {
    const { SUI } = this.context.components;
    return <SUI.Message icon="small bug" size="small" appearance="error" {...this.props}/>
  }
}
