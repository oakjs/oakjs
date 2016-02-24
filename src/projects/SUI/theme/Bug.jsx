export default class Bug extends oak.CustomComponent {
  render() {
    const { components:c } = this.context;
    return <c.Message icon="small bug" size="small" appearance="error" {...props}/>
  }
}
