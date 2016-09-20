static defaultProps = {
  message: "MESSAGE",
  okTitle: "OK",
  cancelTitle: "Cancel"
}

getValue() {
  return this.refs.form.get("value");
}
