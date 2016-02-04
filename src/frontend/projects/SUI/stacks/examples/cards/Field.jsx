"use strict";
import React from "react";
import { Card } from "oak";

export default class FieldCard extends Card {
  static defaultProps = {
    id: "Field",
    title: "Field"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Field">
            A field is a form element containing a label and an input.
            <c.Info>Note that a Field will only display properly if inside a Form.</c.Info>
            <c.Todo>
              <ul>
                <li>Support `type=select'??</li>
                <li>Output field type??</li>
                <li>Add Dropdown, Checkbox, etc examples.</li>
              </ul>
            </c.Todo>
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Inline Content" hint="<Field><Input/></Field>">
              <c.Form>
                <c.Field>
                  <label>First Name</label>
                  <input type="text" placeholder="this field was field specified as an html <input>"/>
                </c.Field>
                <c.Field>
                  <label>First Name</label>
                  <c.Input type="text" placeholder="this field was specified as an SUI <Input>"/>
                </c.Field>
              </c.Form>
            </c.Example>

            <c.Example title="Fields Specified with `type`, `label`, etc Attributes" hint="<Field type='text' label='...'/>">
              <c.Form appearance="equal width">
                <c.Fields>
                  <c.Field type="text" label="type=text"/>
                  <c.Field type="button" label="type=button" value="OK" error="SUI styling messes this up"/>
                  <c.Field type="checkbox" label="type=checkbox" rightLabel="Checkbox label"/>
                </c.Fields>

                <c.Fields>
                  <c.Field type="date" label="type=date"/>
                  <c.Field type="datetime" label="type=datetime"/>
                  <c.Field type="datetime-local" label="type=datetime-local"/>
                </c.Fields>

                <c.Fields>
                  <c.Field type="email" label="type=email"/>
                  <c.Field type="file" label="type=file"/>
                  <c.Field type="hidden" label="type=hidden"/>
                </c.Fields>

                <c.Fields>
                  <c.Field type="image" label="type=image" error="SUI styling messes this up"/>
                  <c.Field type="month" label="type=month"/>
                  <c.Field type="number" min={0} max={10} label="type=number"/>
                </c.Fields>

                <c.Fields>
                  <c.Field type="password" label="type=password"/>
                  <c.Field type="radio" name="a" value="1" rightLabel="Option 1" label="type=radio"/>
                  <c.Field type="range" min={0} max={10} label="type=range"/>
                </c.Fields>

                <c.Fields>
                  <c.Field type="reset" value="Reset" label="type=reset" error="SUI styling messes this up"/>
                  <c.Field type="search" label="type=search"/>
                  <c.Field type="submit" value="Save" label="type=submit" error="SUI styling messes this up"/>
                </c.Fields>

                <c.Fields>
                  <c.Field type="tel" label="type=tel"/>
                  <c.Field type="time" label="type=time"/>
                  <c.Field type="url" label="type=url"/>
                </c.Fields>

                <c.Fields>
                  <c.Field type="week" label="type=week"/>
                  <c.Field type="textarea" label="type=textarea"/>
                </c.Fields>

              </c.Form>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="States">
            <c.Columns>
              <c.Example title="Readonly" hint="<Field readonly/>">
                <c.Form state='error'>
                  <c.Field readonly type="text" label="Read Only Field" value="text"/>
                  <c.Info>Text field is selectable, this is correct according to the standard.</c.Info>
                  <c.Field readonly type="checkbox" rightLabel="Read Only Checkbox"/>
                  <c.Field readonly type="radio" rightLabel="Read Only Radio Button"/>
                </c.Form>
              </c.Example>

              <c.Example title="Disabled" hint="<Field disabled/>">
                <c.Form>
                  <c.Field disabled type="text" label="Disabled Field"/>
                  <c.Field disabled type="checkbox" rightLabel="Disabled Checkbox"/>
                  <c.Field disabled type="radio" rightLabel="Disabled Radio Button"/>
                </c.Form>
              </c.Example>

              <c.Example title="Error" hint="<Field error> or <Field error='...'">
                <c.Form>
                  <c.Field error type="text" label="Error Field with No Error Message"/>
                  <c.Field error="Something went wrong" type="text" label="Error Field with Message"/>
                  <c.Field error="Something went wrong" type="checkbox" rightLabel="Errors work for Checkboxes"/>
                </c.Form>
              </c.Example>
            </c.Columns>

            <c.Columns>
              <c.Example title="Requied" hint="<Field requied>">
                <c.Form>
                  <c.Field required appearance="fluid" type="text" label="Last Name"/>
                  <c.Field required type="checkbox" rightLabel="I agree to the terms and conditions"/>
                </c.Form>
              </c.Example>
            </c.Columns>

          </c.PageSection>

          <c.PageSection title="Appearance">
            <c.Example title="Inline" hint="<Field inline label='...'/>">
              <c.Form>
                <c.Field inline type="text" label="Field Label"/>
                <c.Field inline type="checkbox" label="Field Label" rightLabel="Checkbox label"/>
              </c.Form>
            </c.Example>

            <c.Example title="Width" hint="<Field columns={3}/>">
              <c.Form>
                <c.Fields>
                  <c.Field columns={6} type="text" label="First Name"/>
                  <c.Field columns={4} type="text" label="Middle"/>
                  <c.Field columns={6} type="text" label="Last Name"/>
                </c.Fields>
                <c.Fields>
                  <c.Field columns={2} type="text" placeholder="2 wide"/>
                  <c.Field columns={12} type="text" placeholder="12 wide"/>
                  <c.Field columns={2} type="text" placeholder="2 wide"/>
                </c.Fields>
                <c.Fields>
                  <c.Field columns={8} type="text" placeholder="8 wide"/>
                  <c.Field columns={6} type="text" placeholder="6 wide"/>
                  <c.Field columns={2} type="text" placeholder="2 wide"/>
                </c.Fields>
              </c.Form>
            </c.Example>

          </c.PageSection>


        </c.Page>
      </c.CardContainer>
    );
  }
}
