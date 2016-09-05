getInitialData(context) {
  const { SUI } = context.components;
  return {
    simpleItems: [
      <SUI.MenuHeader>News</SUI.MenuHeader>,
      <SUI.MenuItem active>Editorials</SUI.MenuItem>,
      <SUI.MenuItem>Reviews</SUI.MenuItem>,
      <SUI.MenuItem>Events</SUI.MenuItem>
    ],
  };
}
