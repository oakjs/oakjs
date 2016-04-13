import "./IconSample.css";
export default class IconSample extends oak.components.OakComponent {
  render() {
    const { components: c } = this.context;
    const { icon } = this.props;
    return (
      <div className="IconSample one column">
        <c.Icon icon={icon}/>
        <div className='title'>{icon}</div>
      </div>
    );
  }
}


import { editify } from "oak/EditorProps";
editify({ droppable: false }, IconSample);
