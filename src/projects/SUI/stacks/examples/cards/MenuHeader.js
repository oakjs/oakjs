getInitialData(context) {
  const c = context.components;
  return {

    simpleItems: [
      <c.MenuHeader>News</c.MenuHeader>,
      <c.MenuItem>Editorials</c.MenuItem>,
      <c.MenuItem active>Reviews</c.MenuItem>,
      <c.MenuItem>Events</c.MenuItem>
    ],
  };
}
