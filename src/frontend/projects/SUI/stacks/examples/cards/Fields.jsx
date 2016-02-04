"use strict";
import React from "react";
import { Card } from "oak";

export default class FieldsCard extends Card {
  static defaultProps = {
    id: "Fields",
    title: "Fields"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Fields">
            A set of fields can appear grouped together
            <c.Info>Note that Fields will only display properly if inside a Form.</c.Info>
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Simple">
              <c.Form>
                <c.Fields>
                  <c.Field type="text" label="First Name"/>
                  <c.Field type="text" label="Middle Name"/>
                  <c.Field type="text" label="Last Name"/>
                </c.Fields>
              </c.Form>
            </c.Example>

            <c.Example title="Label attribute">
              <c.Form>
                <c.Fields label="Name">
                  <c.Field type="text" placeholder="First Name"/>
                  <c.Field type="text" placeholder="Middle Name"/>
                  <c.Field type="text" placeholder="Last Name"/>
                </c.Fields>
              </c.Form>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Example title="Evenly Divided" hint="<Fields count={3}/>">
              <c.Form>
                <c.Fields count={3}>
                  <c.Field type="text" label="First Name"/>
                  <c.Field type="text" label="Middle Name"/>
                  <c.Field type="text" label="Last Name"/>
                </c.Fields>
              </c.Form>
            </c.Example>

            <c.Example title="Equal Width" hint="<Fields appearance='equal width'/>">
              <c.Form>
                <c.Fields appearance="equal width">
                  <c.Field type="text" label="Username"/>
                  <c.Field type="password" label="Password"/>
                </c.Fields>
                <c.Fields appearance="equal width">
                  <c.Field type="text" label="First Name"/>
                  <c.Field type="text" label="Middle Name"/>
                  <c.Field type="text" label="Last Name"/>
                </c.Fields>
              </c.Form>
            </c.Example>

            <c.Example title="Grouped" hint="<Fields appearance='grouped'/>">
              <c.Form>
                <c.Fields appearance="grouped" label="Favorite Fruit">
                  <c.Field type="radio" name="fruit" rightLabel="Apples"/>
                  <c.Field type="radio" name="fruit" rightLabel="Oranges"/>
                  <c.Field type="radio" name="fruit" rightLabel="Pears"/>
                  <c.Field type="radio" name="fruit" rightLabel="Grapefruit"/>
                </c.Fields>
              </c.Form>
            </c.Example>

            <c.Example title="Inline" hint="<Fields inline/>">
              <c.Form>
                <c.Fields inline label="Phone Number">
                  <c.Field type="text" columns={2}/>
                  <c.Field type="text" columns={2}/>
                  <c.Field type="text" columns={3}/>
                </c.Fields>

                <c.Fields inline label="Favorite Fruit">
                  <c.Field type="radio" name="fruit" rightLabel="Apples"/>
                  <c.Field type="radio" name="fruit" rightLabel="Oranges"/>
                  <c.Field type="radio" name="fruit" rightLabel="Pears"/>
                  <c.Field type="radio" name="fruit" rightLabel="Grapefruit"/>
                </c.Fields>
              </c.Form>
            </c.Example>

          </c.PageSection>


        </c.Page>
      </c.CardContainer>
    );
  }
}
