import "./Example.css";
const { OakComponent } = oak.components.Oak;
export default class Example extends OakComponent {
  render() {
    const { Oak, SUI, InfoHint } = this.context.components;
    const {
      title, hint,
      className, appearance, compact, columns,
      children,
      ...divProps
    } = this.props;

    divProps.className = roots.react.classNames(
        className, appearance,
  //      (columns ? [SUI.getColumnWidthClass(columns), "column", "unpadded"] : undefined),
        "Example"
    );

    const infoHint = hint && <InfoHint content={hint}/>;
    const header = (title ? <SUI.Header size="medium" dividing>{title}{infoHint}</SUI.Header> : undefined);

    return (
      <div {...divProps}>
        {header}
        <Oak.Spacer/>
        {children}
        <Oak.Spacer massive/>
      </div>
    );
  }
}


import { editify } from "oak/EditorProps";
editify({ droppable: true, nestable: false }, Example);
