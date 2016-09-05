const OakComponent = oak.components.OakComponent;
export default class PageSection extends OakComponent {
  render() {
    const { components: c } = this.context;
    const { "data-oid": oid, id, title, children, grid, appearance, ...segmentProps } = this.props;
    segmentProps.appearance = roots.react.classNames(appearance, "basic", { grid });
    return (
      <c.Segment appearance="basic very padded" id={id} data-oid={oid}>
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


import { editify } from "oak/EditorProps";
editify({ droppable: true }, PageSection);
