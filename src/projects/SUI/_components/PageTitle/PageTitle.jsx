const { OakComponent } = oak.components.Oak;
export default class PageTitle extends OakComponent {
  render() {
    const { page } = this.context;
    const { SUI } = this.context.components;
    const { title, children, ...extraProps } = this.props;
    return (
      <SUI.Segment appearance="basic unpadded" {...extraProps}>
        <SUI.Segment appearance="basic very padded">
          <SUI.Header size="huge">
            <SUI.Button floated="right" onClick={()=>page.forceUpdate()}>Force Update</SUI.Button>
            {title}
            <SUI.Subheader>
              {children}
            </SUI.Subheader>
          </SUI.Header>
        </SUI.Segment>
        <SUI.Divider/>
      </SUI.Segment>
    );
  }
};


import DragProps from "oak/DragProps";
DragProps.register("", { droppable: false }, PageTitle);
