export const LOREM_TEXT = `
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
link mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean
vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut
metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.
Curabitur ullamcorper ultricies nisi.`;

export const LOREM_TEXT_MEDIUM = `
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede
link mollis pretium. Integer tincidunt.`;

export const LOREM_TEXT_SHORT = `
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
Aenean massa strong. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
consequat massa quis enim.`;

export const LOREM_TEXT_TINY = `
Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
Aenean massa strong.`;


export function getLoremText(props) {
  if (props.tiny) return LOREM_TEXT_TINY;
  if (props.short) return LOREM_TEXT_SHORT;
  if (props.medium) return LOREM_TEXT_MEDIUM;
  return LOREM_TEXT;
}

export default class LoremIpsum extends oak.components.OakComponent {
  render() {
    const { id, style, className } = this.props;
    return <div id={id} style={style} className={className}>{getLoremText(props)}</div>;
  }
}
