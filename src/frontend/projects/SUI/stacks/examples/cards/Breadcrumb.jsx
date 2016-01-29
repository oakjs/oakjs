"use strict";
import React from "react";
import { Card } from "oak";

export default class BreadcrumbCard extends Card {
  static defaultProps = {
    id: "Breadcrumb",
    title: "Breadcrumb"
  }

  getInitialData() {
    return {
      map: {"/": "Home", "/store": "Store", "/store/tshirt": "T-Shirt"},
      items: [ { title: "Home", link: "/" }, { title: "Search", link: "/search", active:true } ],
      strings: [ "A", "B", "C", "D" ]
    }
  }

  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
console.warn(data);
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Breadcrumb">
            A breadcrumb is used to show hierarchy between content
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Map of items" hint="<c.Breadcrumb items={{...}}/>">
              <c.Breadcrumb items={data.map}/>
            </c.Example>

            <c.Example title="List of item objects" hint="<c.Breadcrumb items={[ {link, title, active}, ...]}/>">
              <c.Breadcrumb items={data.items}/>
            </c.Example>

            <c.Example title="List of strings" hint="<c.Breadcrumb items={[ '...', '...', ...}/>">
              <c.Breadcrumb items={data.strings}/>
            </c.Example>

            <c.Example title="Inline content" hint="<c.Breadcrumb>...</c.Breadcrumb>">
              <c.Breadcrumb>
                <a href="#" className="section">Home</a>
                <div className="divider">/</div>
                <div className="active section">Search for: <a href="#">paper towels</a></div>
              </c.Breadcrumb>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Text divider" hint="<c.Breadcrumb divider='/'/>">
              <c.Breadcrumb items={data.map}/>
              <c.Spacer/>
              <c.Breadcrumb divider="•" items={data.map}/>
            </c.Example>

            <c.Example title="Icon divider" hint="<c.Breadcrumb icon='right chevron'/>">
              <c.Breadcrumb icon="right chevron" items={data.map}/>
              <c.Spacer/>
              <c.Breadcrumb icon="right arrow" items={data.map}/>
            </c.Example>


            <c.Example title="Size" hint="<c.Breadcrumb size='small'/>">
              <c.Breadcrumb size='small'items={data.map}/>
              <c.Spacer/>
              <c.Breadcrumb size='medium'items={data.map}/>
              <c.Spacer/>
              <c.Breadcrumb size='large'items={data.map}/>
              <c.Spacer/>
              <c.Breadcrumb size='huge'items={data.map}/>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
