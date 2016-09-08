getInitialData(context) {
  const { SUI } = context.components;
  return {

    simpleItems: [
      <SUI.MenuHeader>News</SUI.MenuHeader>,
      <SUI.MenuItem active>Editorials</SUI.MenuItem>,
      <SUI.MenuItem>Reviews</SUI.MenuItem>,
      <SUI.MenuItem>Events</SUI.MenuItem>
    ],

    homeToLogoutItems: [
      <SUI.MenuItem active>Home</SUI.MenuItem>,
      <SUI.MenuItem>Messages</SUI.MenuItem>,
      <SUI.MenuItem>Friends</SUI.MenuItem>,
      <SUI.Menu appearance="right">
        <SUI.MenuItem>
          <SUI.Input icon="search" iconOn="right" placeholder="Search"/>
        </SUI.MenuItem>
        <SUI.MenuItem>Logout</SUI.MenuItem>
      </SUI.Menu>,
    ],

    topTabItems: [
      <SUI.MenuItem active>Bio</SUI.MenuItem>,
      <SUI.MenuItem>Photos</SUI.MenuItem>,
      <SUI.MenuItem appearance="right">
        <SUI.Input appearance="transparent" icon="search" iconOn="right" placeholder="Search users..."/>
      </SUI.MenuItem>
    ],

    bottomTabItems: [
      <SUI.MenuItem active>Active Project</SUI.MenuItem>,
      <SUI.MenuItem>Project #2</SUI.MenuItem>,
      <SUI.MenuItem>Project #3</SUI.MenuItem>,
      <SUI.Menu appearance="right">
        <SUI.MenuItem icon="plus">New Tab</SUI.MenuItem>
      </SUI.Menu>
    ],

    textItems: [
      <SUI.MenuHeader>Sort by</SUI.MenuHeader>,
      <SUI.MenuItem active>Closest</SUI.MenuItem>,
      <SUI.MenuItem>Most Comments</SUI.MenuItem>,
      <SUI.MenuItem>Most Popular</SUI.MenuItem>,
    ],

    verticalItems: [
      <SUI.MenuItem active>Account</SUI.MenuItem>,
      <SUI.MenuItem>Settings</SUI.MenuItem>,
      <SUI.MenuItem>Options...</SUI.MenuItem>,
    ],

    paginationItems: [
      <SUI.MenuItem disabled icon="left chevron"/>,
      <SUI.MenuItem active>1</SUI.MenuItem>,
      <SUI.MenuItem>2</SUI.MenuItem>,
      <SUI.MenuItem>3</SUI.MenuItem>,
      <SUI.MenuItem>...</SUI.MenuItem>,
      <SUI.MenuItem>10</SUI.MenuItem>,
      <SUI.MenuItem>11</SUI.MenuItem>,
      <SUI.MenuItem>12</SUI.MenuItem>,
      <SUI.MenuItem icon="right chevron"/>
    ],

    iconItems: [
      <SUI.MenuItem icon="gamepad"/>,
      <SUI.MenuItem icon="camera"/>,
      <SUI.MenuItem icon="video camera"/>,
      <SUI.MenuItem icon="video play"/>,
    ],

    labeledIconItems: [
      <SUI.MenuItem icon="gamepad">Games</SUI.MenuItem>,
      <SUI.MenuItem icon="camera">Photos</SUI.MenuItem>,
      <SUI.MenuItem icon="video camera">Channels</SUI.MenuItem>,
      <SUI.MenuItem icon="video play">Videos</SUI.MenuItem>,
    ]

  }
}
