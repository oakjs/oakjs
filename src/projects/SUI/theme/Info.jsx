export default class Info extends oak.CustomComponent {
  render() {
    const { components:c } = this.context;
    return <c.Message icon="small info circle" size="small" appearance="info" {...this.props}/>
  }
}
