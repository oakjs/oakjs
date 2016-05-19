getInitialData({ page, components:c }) {
  return {
    iconMenu: [
      <c.MenuItem icon="home">Home</c.MenuItem>,
      <c.MenuItem icon="block layout">Topics</c.MenuItem>,
      <c.MenuItem icon="smile">Friends</c.MenuItem>,
      <c.MenuItem icon="calendar">History</c.MenuItem>,
    ],
  }
}

adjustTransitionAndShow(ref, transition) {
  return () => {
    const sidebar = this.refs[ref];
    if (sidebar.isVisible()) {
      sidebar.hide();
    }
    else {
      sidebar.setTransition(transition);
      sidebar.show();
    }
  }
}
