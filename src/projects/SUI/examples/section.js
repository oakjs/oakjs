componentDidMount() {
  console.warn("examples section mount");
   $("#PageSidebarMenu").sticky({
     context: ".oak.current.Page"
   });
}

componentWillUnmount() {
  console.warn("examples section unmount");
}
