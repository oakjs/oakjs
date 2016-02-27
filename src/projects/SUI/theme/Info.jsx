export default class Info extends oak.OakComponent {
  render() {
    const { components:c } = this.context;
    return <c.Message icon="small info circle" size="small" appearance="info" {...this.props}/>
  }
}
