getInitialData(context) {
  const { SUI } = context.components;
  return {

    simpleItems: [
      <SUI.MenuHeader icon="newspaper">Breaking News</SUI.MenuHeader>,
      <SUI.MenuItem icon="comment outline">Editorials</SUI.MenuItem>,
      <SUI.MenuItem active icon="film">Movie Reviews</SUI.MenuItem>,
      <SUI.MenuItem icon="calendar">Current Events</SUI.MenuItem>
    ],
  };
}
