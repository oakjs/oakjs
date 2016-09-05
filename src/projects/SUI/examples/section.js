componentDidMount() {
   $("#PageSidebarMenu").sticky({
     context: ".oak.current.Page"
   });
}

componentDidUpdate() {
   $("#PageSidebarMenu").sticky({
     context: ".oak.current.Page"
   });
}

componentWillUnmount() {
  console.warn("examples section unmount");
}
