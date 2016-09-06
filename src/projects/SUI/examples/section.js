get stickyContext() {
  return $("#PageSidebarMenu")
    .closest(".oak.Section")
    .find(".oak.Page");
}

componentDidMount() {
  $("#PageSidebarMenu").sticky({
    context: this.stickyContext
  });
}

componentDidUpdate() {
  $("#PageSidebarMenu").sticky({
    context: this.stickyContext
  });
}
