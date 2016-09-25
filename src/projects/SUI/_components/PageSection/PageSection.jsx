const { OakComponent } = oak.components.Oak;
export default class PageSection extends OakComponent {
  render() {
    const { SUI } = this.context.components;
    const { "data-oid": oid, id, title, children, grid, appearance, ...segmentProps } = this.props;
    segmentProps.appearance = roots.react.classNames(appearance, "basic", { grid });
    return (
      <SUI.Segment appearance="basic very padded" id={id} data-oid={oid}>
        <SUI.Header size="large" dividing>
          {title}
        </SUI.Header>
        <SUI.Segment {...segmentProps}>
          {children}
        </SUI.Segment>
      </SUI.Segment>
    );
  }
}


import DragProps from "oak/DragProps";
DragProps.register("", { droppable: true }, PageSection);
