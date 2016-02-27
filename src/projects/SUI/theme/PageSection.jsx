export default class Section extends oak.OakComponent {
  render() {
    const { components: c } = this.context;
    const { id, title, children, grid, appearance, ...segmentProps } = this.props;
    segmentProps.appearance = roots.react.classNames(appearance, "basic", { grid });
    return (
      <c.Segment appearance="basic very padded" id={id}>
        <c.Header size="large" dividing>
          {title}
        </c.Header>
        <c.Segment {...segmentProps}>
          {children}
        </c.Segment>
      </c.Segment>
    );
  }
}
