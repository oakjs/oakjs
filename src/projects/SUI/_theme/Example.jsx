import "./Example.css";
const OakComponent = oak.components.OakComponent;
export default class Example extends OakComponent {
  render() {
    const { components: c } = this.context;
    const {
      title, hint,
      className, appearance, compact, columns,
      children,
      ...divProps
    } = this.props;

    divProps.className = roots.react.classNames(
        className, appearance,
  //      (columns ? [c.SUI.getColumnWidthClass(columns), "column", "unpadded"] : undefined),
        "Example"
    );

    const infoHint = hint && <c.InfoHint content={hint}/>;
    const header = (title ? <c.Header size="medium" dividing>{title}{infoHint}</c.Header> : undefined);

    return (
      <div {...divProps}>
        {header}
        <c.Spacer/>
        {children}
        <c.Spacer massive/>
      </div>
    );
  }
}


import { editify } from "oak/EditorProps";
editify({ droppable: true, nestable: false }, Example);
