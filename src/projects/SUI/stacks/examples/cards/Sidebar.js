getInitialData({ card, components:c }) {
  console.warn(c);
  return {
    iconMenu: [
      <MenuItem icon="home">Home</MenuItem>,
      <MenuItem icon="block layout">Topics</MenuItem>,
      <MenuItem icon="smile">Friends</MenuItem>,
      <MenuItem icon="calendar">History</MenuItem>,
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
