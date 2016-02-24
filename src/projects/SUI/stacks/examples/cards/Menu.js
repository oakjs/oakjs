getInitialData(context) {
  const c = context.components;
  return {

    simpleItems: [
      <c.MenuHeader>News</c.MenuHeader>,
      <c.MenuItem active>Editorials</c.MenuItem>,
      <c.MenuItem>Reviews</c.MenuItem>,
      <c.MenuItem>Events</c.MenuItem>
    ],

    homeToLogoutItems: [
      <c.MenuItem active>Home</c.MenuItem>,
      <c.MenuItem>Messages</c.MenuItem>,
      <c.MenuItem>Friends</c.MenuItem>,
      <c.Menu appearance="right">
        <c.MenuItem>
          <c.Input icon="search" iconOn="right" placeholder="Search"/>
        </c.MenuItem>
        <c.MenuItem>Logout</c.MenuItem>
      </c.Menu>,
    ],

    topTabItems: [
      <c.MenuItem active>Bio</c.MenuItem>,
      <c.MenuItem>Photos</c.MenuItem>,
      <c.MenuItem appearance="right">
        <c.Input appearance="transparent" icon="search" iconOn="right" placeholder="Search users..."/>
      </c.MenuItem>
    ],

    bottomTabItems: [
      <c.MenuItem active>Active Project</c.MenuItem>,
      <c.MenuItem>Project #2</c.MenuItem>,
      <c.MenuItem>Project #3</c.MenuItem>,
      <c.Menu appearance="right">
        <c.MenuItem icon="plus">New Tab</c.MenuItem>
      </c.Menu>
    ],

    textItems: [
      <c.MenuHeader>Sort by</c.MenuHeader>,
      <c.MenuItem active>Closest</c.MenuItem>,
      <c.MenuItem>Most Comments</c.MenuItem>,
      <c.MenuItem>Most Popular</c.MenuItem>,
    ],

    verticalItems: [
      <c.MenuItem active>Account</c.MenuItem>,
      <c.MenuItem>Settings</c.MenuItem>,
      <c.MenuItem>Options...</c.MenuItem>,
    ],

    paginationItems: [
      <c.MenuItem disabled icon="left chevron"/>,
      <c.MenuItem active>1</c.MenuItem>,
      <c.MenuItem>2</c.MenuItem>,
      <c.MenuItem>3</c.MenuItem>,
      <c.MenuItem>...</c.MenuItem>,
      <c.MenuItem>10</c.MenuItem>,
      <c.MenuItem>11</c.MenuItem>,
      <c.MenuItem>12</c.MenuItem>,
      <c.MenuItem icon="right chevron"/>
    ],

    iconItems: [
      <c.MenuItem icon="gamepad"/>,
      <c.MenuItem icon="camera"/>,
      <c.MenuItem icon="video camera"/>,
      <c.MenuItem icon="video play"/>,
    ],

    labeledIconItems: [
      <c.MenuItem icon="gamepad">Games</c.MenuItem>,
      <c.MenuItem icon="camera">Photos</c.MenuItem>,
      <c.MenuItem icon="video camera">Channels</c.MenuItem>,
      <c.MenuItem icon="video play">Videos</c.MenuItem>,
    ]

  }
}
