getInitialData(context) {
  const c = context.components;
  return {
    simpleItems: [
      <c.MenuHeader>News</c.MenuHeader>,
      <c.MenuItem active>Editorials</c.MenuItem>,
      <c.MenuItem>Reviews</c.MenuItem>,
      <c.MenuItem>Events</c.MenuItem>
    ],
  };
}
