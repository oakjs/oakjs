export default class PageTitle extends oak.components.OakComponent {
  render() {
    const { page, components:c } = this.context;
    const { title, children, ...extraProps } = this.props;
    return (
      <c.Segment appearance="basic unpadded" {...extraProps}>
        <c.Segment appearance="basic very padded">
          <c.Header size="huge">
            <c.Button floated="right" onClick={()=>page.forceUpdate()}>Force Update</c.Button>
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


import { editify } from "oak/EditorProps";
editify({ droppable: false }, PageTitle);
