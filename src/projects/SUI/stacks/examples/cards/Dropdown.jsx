"use strict";
import React from "react";
import Card from "oak/Card";

export default class DropdownCard extends Card {
  static defaultProps = {
    id: "Dropdown",
    title: "Dropdown"
  }

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


  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Dropdown">
            A dropdown allows a user to select a value from a series of options
            <c.Todo>
              <ul>
                <li>Event handling</li>
                <li>Remote loading stuff</li>
              </ul>
            </c.Todo>
          </c.PageTitle>

          <c.PageSection title="Types">
            <c.Example title="Dropdown">
              <c.Dropdown text="File" items={data.fileMenu} action="hide"/>
            </c.Example>

            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Selection" hint="<Dropdown selection/>">
                  <c.Dropdown selection placeholder="Gender" items={data.genderMenu}/>
                  <c.Spacer/>
                  <c.Dropdown selection placeholder="Select Friend" items={data.friendMenu}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Search Selection" hint="<Dropdown search selection/>">
                  <c.Dropdown search selection placeholder="Select Friend" items={data.friendMenu}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Multiple Selection" hint="<Dropdown multiple selection/>">
                  <c.Dropdown multiple selection placeholder="Select Friends" items={data.friendMenu}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Multiple Search Selection" hint="<Dropdown multiple search selection/>">
                  <c.Dropdown multiple search selection placeholder="Select Friends" items={data.friendMenu}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Search Button Dropdown" hint="<Dropdown search type='button' showArrow={false}/>">
                  <c.Dropdown search type='labeled icon button' showArrow={false} icon="world" text="Select Language" appearance="floating" items={data.languageMenu}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Search In Menu">
                  <c.Dropdown search type='labeled icon button' showArrow={false} icon="filter" text="Filter Posts" appearance="floating" items={data.filterMenu}/>
                  <c.Todo>Make a special component for the search input?</c.Todo>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Inline">
                  <c.Header icon="trophy">
                    Trending repos <c.Dropdown ref="inline" inline text="" value="Today" items={data.timeMenu}/>
                  </c.Header>
                  <c.Bug>Doesn't display the value unless you add `text=""`...</c.Bug>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Pointing">
                  <c.Menu>
                    <c.MenuItem href="#">Home</c.MenuItem>
                    <c.MenuItem href="#">Forums</c.MenuItem>
                    <c.Dropdown text="Language:" type="right link item" appearance="pointing" items={data.languageMenu}/>
                  </c.Menu>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Floating">
                  <c.Buttons color="teal">
                    <c.Button>Save</c.Button>
                    <c.Dropdown type="icon button" appearance="floating" items={data.comboMenu}/>
                  </c.Buttons>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Combo" hint="<Dropdown action='combo' type='combo icon button'/>">
                  <c.Buttons color="teal">
                    <c.Button>Save</c.Button>
                    <c.Dropdown type="combo icon button" action="combo" items={data.comboMenu}/>
                  </c.Buttons>
                </c.Example>
              </c.Column>
            </c.Grid>
          </c.PageSection>


          <c.PageSection title="States">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Loading" hint="<Dropdown loading/>">
                  <c.Dropdown selection placeholder="Search" loading items={data.friendMenu}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Error" hint="<Dropdown error/>">
                  <c.Dropdown error="Something went wrong" text="Friends" items={data.friendMenu}/>
                  <c.Spacer/>
                  <c.Dropdown error="Something went wrong" selection text="Select Friend" items={data.friendMenu}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Hidden" hint="<Dropdown hidden/>">
                  <c.Dropdown hidden text="Friends" items={data.friendMenu}/>
                  <c.Spacer/>
                  <c.Dropdown hidden selection text="Select Friend" items={data.friendMenu}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Read Only" hint="<Dropdown readonly/>">
                  <c.Dropdown readonly text="Friends" items={data.friendMenu}/>
                  <c.Spacer/>
                  <c.Dropdown readonly selection text="Select Friend" items={data.friendMenu}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Disabled" hint="<Dropdown disabled/>">
                  <c.Dropdown disabled text="Friends" items={data.friendMenu}/>
                  <c.Spacer/>
                  <c.Dropdown disabled selection text="Select Friend" items={data.friendMenu}/>
                </c.Example>
              </c.Column>

            </c.Grid>
          </c.PageSection>

          <c.PageSection title="Appearance">
            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Scrolling" hint="<Dropdown appearance='scrolling'/>">
                  <c.Dropdown appearance="scrolling" selection placeholder="Select Language" items={data.languageMenu}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Compact" hint="<Dropdown appearance='compact'/>">
                  <c.Dropdown appearance="compact" selection placeholder="Compact" items={data.genderMenu}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Fluid" hint="<Dropdown appearance='fluid'/>">
                  <c.Dropdown appearance="fluid" selection placeholder="Compact" items={data.genderMenu}/>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Transition" hint="<Dropdown transition='horizontal flip'/>">
                  <c.Dropdown transition="horizontal flip" appearance="floating" selection placeholder="Compact" items={data.genderMenu}/>
                </c.Example>
              </c.Column>
            </c.Grid>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
