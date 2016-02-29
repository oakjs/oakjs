getInitialData() {
  return {
    fileMenu: {"new":"New", "open":"Open", "saveas": "Save as...", "rename": "Rename" },
    genderMenu: [ "Male", "Female" ],
    friendMenu: [
      { value: "jenny", label: "Jenny Hess", image:<img className="ui mini avatar image" src="http://semantic-ui.com/images/avatar/small/jenny.jpg"/>},
      { value: "elliot", label: "Elliot Fu", image:<img className="ui mini avatar image" src="http://semantic-ui.com/images/avatar/small/elliot.jpg"/>},
      { value: "stevie", label: "Stevie Feliciano", image:<img className="ui mini avatar image" src="http://semantic-ui.com/images/avatar/small/stevie.jpg"/>},
      { value: "christian", label: "Christian", image:<img className="ui mini avatar image" src="http://semantic-ui.com/images/avatar/small/christian.jpg"/>},
    ],
    languageMenu:  [
      "Arabic", "Chinese", "Danish", "Dutch", "English", "French", "German", "Greek", "Hungarian",
      "Italian", "Japanese", "Korean", "Lithuanian", "Persian", "Polish", "Portuguese", "Russian",
      "Spanish", "Swedish", "Turkish", "Vietnamese"
    ],
    filterMenu: [
      <div className="ui icon search input"><i className="search icon"/><input type='text' placeholder="Search tags..."/></div>,
      "----",
      "#Tag Label",
      "Important",
      "Announcement",
      "Cannot Fix",
      "News",
      "Enhancement",
    ],

    timeMenu: [
      "#Adjust time span",
      "Today",
      "This Week",
      "This Month"
    ],

    comboMenu: [
      { value: "Edit", icon: "edit" },
      { value: "Delete", icon: "delete" },
      { value: "Hide", icon: "hide" },
    ]


  };
}
