import "./IconSample.css";
const { OakComponent } = oak.components.Oak;
export default class IconSample extends OakComponent {
  render() {
    const { SUI } = this.context.components;
    const { icon } = this.props;
    return (
      <div className="IconSample one column">
        <SUI.Icon icon={icon}/>
        <div className='title'>{icon}</div>
      </div>
    );
  }
}


import { editify } from "oak/EditorProps";
editify("", { droppable: false }, IconSample);
