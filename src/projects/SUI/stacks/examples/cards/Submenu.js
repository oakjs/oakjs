getInitialData(context) {
  const c = context.components;
  return {

    simpleItems: [
      <c.MenuHeader icon="newspaper">Breaking News</c.MenuHeader>,
      <c.MenuItem icon="comment outline">Editorials</c.MenuItem>,
      <c.MenuItem active icon="film">Movie Reviews</c.MenuItem>,
      <c.MenuItem icon="calendar">Current Events</c.MenuItem>
    ],
  };
}
