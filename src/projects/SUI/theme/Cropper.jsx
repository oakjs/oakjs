import "./Cropper.css";
export default class Cropper extends oak.CustomComponent {
  render() {
    const { width, height, children, showOnHover, ...cropperProps } = this.props;

    cropperProps.className = roots.react.classNames("Cropper", cropperProps.className, { showOnHover });
    cropperProps.style = Object.assign({ width, height }, cropperProps.style);

    return (
      <div {...cropperProps}>{children}</div>
    );
  }
}
