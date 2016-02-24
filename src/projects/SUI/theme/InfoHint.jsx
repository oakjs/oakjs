export default class InfoHint extends oak.CustomComponent {
  render() {
    const { components:c } = this.context;
    return (
      <span style={{cursor:"pointer", marginLeft:10}}>
        <c.Icon circular icon="info" appearance="tiny grey inverted"/>
        <c.Popup appearance="very wide" {...this.props}/>
      </span>
    );
  }
}
