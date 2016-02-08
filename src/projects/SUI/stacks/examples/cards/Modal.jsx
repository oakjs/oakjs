"use strict";
import React from "react";
import { Card } from "oak";

export default class ModalCard extends Card {
  static defaultProps = {
    id: "Modal",
    title: "Modal"
  }
  // add render method so we get hot reload
  render() { return super.render() }

  // actual card render
  renderChildren({ data, card, stack, project, c }) {
    return (
      <c.CardContainer>
        <c.PageSidebar/>
        <c.Page>
          <c.PageTitle title="Modal">
            A modal displays content that temporarily blocks interactions with the main view of a site
            <c.Todo>
              <ul>
                <li>Test events</li>
              </ul>
            </c.Todo>
          </c.PageTitle>

          <c.PageSection title="Content">

            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Inline Content">
                  <c.Modal ref="inline">
                    <div className="header">Inline Header</div>
                    <div className="content">
                      <c.LoremIpsum/>
                    </div>
                    <div className="actions">
                      <c.Button className="approve">OK</c.Button>
                      <c.Button className="cancel">Cancel</c.Button>
                    </div>
                  </c.Modal>
                  <c.Button onClick={()=> card.refs.inline.show()}>Show Modal</c.Button>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Header, Content, Actions Attributes">
                  <c.Modal ref="attributes" header="Header Attribute" content={<c.LoremIpsum short/>} actions={["OK"]}/>
                  <c.Button onClick={()=> card.refs.attributes.show()}>Show Modal</c.Button>
                </c.Example>
              </c.Column>

            </c.Grid>
          </c.PageSection>

          <c.PageSection title="Appearance">

            <c.Grid columns={2}>
              <c.Column>
                <c.Example title="Basic" hint="<Modal appearance='basic'/>">
                  <c.Modal ref="basic" appearance="basic" header="Header Attribute" content={<c.LoremIpsum short/>} actions={["OK"]}/>
                  <c.Button onClick={()=> card.refs.basic.show()}>Show Modal</c.Button>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Size" hint="<Modal size='large'/>">
                  <c.Modal ref="small" size="small" header="Header Attribute" content={<c.LoremIpsum short/>} actions={["OK"]}/>
                  <c.Button onClick={()=> card.refs.small.show()}>Show Small Modal</c.Button>

                  <c.Modal ref="large" size="large" header="Header Attribute" content={<c.LoremIpsum short/>} actions={["OK"]}/>
                  <c.Button onClick={()=> card.refs.large.show()}>Show Large Modal</c.Button>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Full Screen" hint="<Modal appearance='fullscreen'/>">
                  <c.Modal ref="fullscreen" appearance="fullscreen" header="Header Attribute" content={<c.LoremIpsum short/>} actions={["OK"]}/>
                  <c.Button onClick={()=> card.refs.fullscreen.show()}>Show Modal</c.Button>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Transitions" hint="<Modal transition='horizontal flip'/>">
                  <c.Modal ref="transition" header="Transition Tester" content={<c.LoremIpsum short/>} actions={["OK"]}/>
                  <c.Button onClick={()=> card.refs.transition.setModuleProps({transition:"horizontal flip"}).show()}>Horizontal Flip</c.Button>
                  <c.Button onClick={()=> card.refs.transition.setModuleProps({transition:"vertical flip"}).show()}>Vertical Flip</c.Button>
                  <c.Spacer/>
                  <c.Button onClick={()=> card.refs.transition.setModuleProps({transition:"fade up"}).show()}>Fade Up</c.Button>
                  <c.Button onClick={()=> card.refs.transition.setModuleProps({transition:"fade"}).show()}>Fade</c.Button>
                  <c.Spacer/>
                  <c.Button onClick={()=> card.refs.transition.setModuleProps({transition:"scale"}).show()}>Scale</c.Button>
                </c.Example>
              </c.Column>

              <c.Column>
                <c.Example title="Dimmer Appearance" hint="<Modal inverted blurring/>">
                  <c.Modal ref="inverted" inverted header="Header Attribute" content={<c.LoremIpsum short/>} actions={["OK"]}/>
                  <c.Button onClick={()=> card.refs.inverted.show()}>Show Inverted Modal</c.Button>
                  <c.Bug>Oak bug: ??? Inverted setting doesn't seem to work. ??? </c.Bug>
                  <c.Spacer/>
                  <c.Modal ref="blurring" blurring header="Header Attribute" content={<c.LoremIpsum short/>} actions={["OK"]}/>
                  <c.Button onClick={()=> card.refs.blurring.show()}>Show Blurring Modal</c.Button>
                  <c.Bug>SUI Bug: Once any blurring modal has been shown, all other modals will be blurring until page reload.</c.Bug>
                </c.Example>
              </c.Column>

            </c.Grid>
          </c.PageSection>

        </c.Page>
      </c.CardContainer>
    );
  }
}
