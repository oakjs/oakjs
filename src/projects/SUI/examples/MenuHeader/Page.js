getInitialData(context) {
  const { SUI } = context.components;
  return {

    simpleItems: [
      <SUI.MenuHeader>News</SUI.MenuHeader>,
      <SUI.MenuItem>Editorials</SUI.MenuItem>,
      <SUI.MenuItem active>Reviews</SUI.MenuItem>,
      <SUI.MenuItem>Events</SUI.MenuItem>
    ],
  };
}
