export default class PageTitle extends oak.components.OakComponent {
  render() {
    const { card, components:c } = this.context;
    const { title, children } = this.props;
    return (
      <c.Segment appearance="basic unpadded">
        <c.Segment appearance="basic very padded">
          <c.Header size="huge">
            <c.Button floated="right" onClick={()=>card.forceUpdate()}>Force Update</c.Button>
            {title}
            <c.Subheader>
              {children}
            </c.Subheader>
          </c.Header>
        </c.Segment>
        <c.Divider/>
      </c.Segment>
    );
  }
};
