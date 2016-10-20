render() {
  const { oak } = this.context;
  const { Oak, SUI, InfoHint } = this.context.components;
  const props = this.props;

  const divProps = {
    id: props.id,
    style: props.style,
    className: oak.classNames(
      props.className,
      props.appearance,
      "Example"
    )
  };

  const infoHint = props.hint && <InfoHint content={props.hint}/>;
  const header = (props.title ? <SUI.Header size="medium" dividing>{props.title}{infoHint}</SUI.Header> : undefined);

  return (
    <div {...divProps}>
      {header}
      <Oak.Spacer/>
      {props.children}
      <Oak.Spacer massive/>
    </div>
  );
}
