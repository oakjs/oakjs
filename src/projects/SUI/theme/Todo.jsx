export default class Todo extends oak.OakComponent {
  render() {
    const { components:c } = this.context;
    return <c.Message icon="small checkmark" size="small" appearance="success" header="TODO:" {...this.props}/>
  }
};
