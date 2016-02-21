"use strict";
import React from "react";
import Card from "oak/Card";

export default class FormCard extends Card {
  static defaultProps = {
    id: "Form",
    title: "Form"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Form">
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Example title="Simple Form">
              <c.Form>
                <c.Field label="First Name" type="text" placeholder="First Name"/>
                <c.Field label="Last Name" type="text" placeholder="Last Name"/>
                <c.Field type="checkbox" rightLabel="I agree to the terms and conditions"/>
                <c.Button type="submit">Save</c.Button>
              </c.Form>
            </c.Example>

            <c.Example title="Complex Layout with Fields">
              <c.Form>
                <c.Header dividing>Shipping Information</c.Header>
                <c.Fields count={2} label="Name">
                  <c.Field type="text" placeholder="First Name"/>
                  <c.Field type="text" placeholder="Last Name"/>
                </c.Fields>
                <c.Fields label="Billing Address">
                  <c.Field columns={12} type="text" placeholder="Street Address"/>
                  <c.Field columns={4} type="text" placeholder="Apt #"/>
                </c.Fields>
                <c.Fields count={2}>
                    <c.Field type="text" label="State" placeholder="State"/>
                    <c.Field type="text" label="Country "placeholder="Country"/>
                </c.Fields>

                <c.Header dividing>Billing Information</c.Header>
                <c.Field label="Card Type" type="text" placeholder="Type"/>
                <c.Fields>
                  <c.Field columns={7} type="text" label="Card Number" placeholder="Card #"/>
                  <c.Field columns={3} type="text" label="CVC" placeholder="CVC"/>
                  <c.Field columns={6} label="Expiration">
                    <c.Fields count={2}>
                      <c.Field type="text" placeholder="Month"/>
                      <c.Field type="text" placeholder="Year"/>
                    </c.Fields>
                  </c.Field>
                </c.Fields>

                <c.Button type="submit">Submit Order</c.Button>
              </c.Form>
            </c.Example>

          </c.PageSection>

          <c.PageSection title="States">

            <c.Example title="Loading" hint="<Form loading/>">
              <c.Form loading>
                <c.Field label="E-mail" type="text" placeholder="joe@schmoe.com"/>
                <c.Button type="submit">Sign up For Newsletter</c.Button>
              </c.Form>
            </c.Example>

            <c.Example title="Success" hint="<Form state='success'/>">
              <c.Form state='success'>
                <c.Field label="E-mail" type="text" placeholder="joe@schmoe.com"/>
                <c.Message appearance="success" header="Form Completed" content="You're all signed up for the newsletter"/>
                <c.Button type="submit" disabled>Sign up For Newsletter</c.Button>
              </c.Form>
            </c.Example>

            <c.Example title="Error" hint="<Form state='error'/>">
              <c.Form state='error'>
                <c.Field label="E-mail" type="text" placeholder="joe@schmoe.com"/>
                <c.Message appearance="error" content="This address has already been signed up."/>
                <c.Button type="submit">Sign up For Newsletter</c.Button>
              </c.Form>
            </c.Example>

            <c.Example title="Warning" hint="<Form state='warning'/>">
              <c.Form state='warning'>
                <c.Field label="E-mail" type="text" placeholder="joe@schmoe.com"/>
                <c.Message appearance="warning" content="This address has already signed up, but you have not clicked the link in the confirmation email."/>
                <c.Button type="submit">Sign up For Newsletter</c.Button>
              </c.Form>
            </c.Example>

          </c.PageSection>


          <c.PageSection title="Appearance">

            <c.Example title="Size" hint="<Form appearance='equal width'/>">
              <c.Form appearance="equal width">
                <c.Fields>
                  <c.Field type="text" label="Username" placeholder="Username"/>
                  <c.Field type="password" label="Password"/>
                </c.Fields>
                <c.Fields>
                  <c.Field type="text" label="First Name" placeholder="First Name"/>
                  <c.Field type="text" label="Middle Name" placeholder="Middle Name"/>
                  <c.Field type="text" label="Last Name" placeholder="Last Name"/>
                </c.Fields>
              </c.Form>
            </c.Example>

            <c.Example title="Size" hint="<Form size='large'/>">
              <c.Columns>
                <c.Form size='small'>
                  <c.Label pointing="down" color="teal">size=small</c.Label>
                  <c.Field label="E-mail" type="text" placeholder="joe@schmoe.com"/>
                  <c.Button type="submit">Sign up For Newsletter</c.Button>
                </c.Form>
                <c.Form size='medium'>
                  <c.Label pointing="down" color="teal">size=medium (default)</c.Label>
                  <c.Field label="E-mail" type="text" placeholder="joe@schmoe.com"/>
                  <c.Button type="submit">Sign up For Newsletter</c.Button>
                </c.Form>
                <c.Form size='large'>
                  <c.Label pointing="down" color="teal">size=large</c.Label>
                  <c.Field label="E-mail" type="text" placeholder="joe@schmoe.com"/>
                  <c.Button type="submit">Sign up For Newsletter</c.Button>
                </c.Form>
              </c.Columns>
            </c.Example>

            <c.Example title="Inverted" hint="<Form appearance='inverted'/>">
              <c.Segment appearance="inverted">
                <c.Form appearance="inverted">
                  <c.Fields count={2}>
                    <c.Field label="First Name" type="text" placeholder="First Name"/>
                    <c.Field label="Last Name" type="text" placeholder="Last Name"/>
                  </c.Fields>
                  <c.Field type="checkbox" rightLabel="I agree to the terms and conditions"/>
                  <c.Button type="submit">Sign up For Newsletter</c.Button>
                </c.Form>
              </c.Segment>
            </c.Example>

          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
