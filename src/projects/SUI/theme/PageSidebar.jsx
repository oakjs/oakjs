export default class PageSidebar extends oak.OakComponent {
  render() {
    const {components: c } = this.context;
    return (
      <c.Sidebar id="PageSidebar" visible direction="left" dimPage={false} appearance="inverted vertical sticky menu">
        <c.MenuHeader>Components</c.MenuHeader>
        <c.StackMenu appearance="inverted vertical"/>
      </c.Sidebar>
    );
  }
};
