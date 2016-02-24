export default class Todo extends oak.CustomComponent {
  render() {
    const { components:c } = this.context;
    return <c.Message icon="small checkmark" size="small" appearance="success" header="TODO:" {...this.props}/>
  }
};
