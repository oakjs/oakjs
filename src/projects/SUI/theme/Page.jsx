export default class Page extends oak.CustomComponent {
  render() {
    const { components: c } = this.context;
    return (
      <c.Pusher className="Page">
        {this.props.children}
      </c.Pusher>
    );
  }
}
