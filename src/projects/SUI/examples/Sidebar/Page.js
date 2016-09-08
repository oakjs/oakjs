getInitialData(context) {
  const { SUI } = context.components;
  return {
    iconMenu: [
      <SUI.MenuItem icon="home">Home</SUI.MenuItem>,
      <SUI.MenuItem icon="block layout">Topics</SUI.MenuItem>,
      <SUI.MenuItem icon="smile">Friends</SUI.MenuItem>,
      <SUI.MenuItem icon="calendar">History</SUI.MenuItem>,
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
