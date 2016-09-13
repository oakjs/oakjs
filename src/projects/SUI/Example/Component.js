render() {
  const { Oak, SUI, InfoHint } = this.context.components;
  const {
    title, hint,
    className, appearance, compact, columns,
    children
  } = this.props;

  const divProps = Object.assign({}, this.props);
  delete divProps.children;
  delete divProps.title;

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
