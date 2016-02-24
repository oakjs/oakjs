export default class Warning extends oak.CustomComponent {
  render() {
    const { components:c } = this.context;
    return <c.Message icon="small warning sign" size="small" appearance="warning" {...this.props}/>
  }
}
